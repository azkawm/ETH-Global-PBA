"use client";
import { useState, useEffect, useRef } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import QrScanner from "react-qr-scanner";
import { transportTrackerContract } from "../../client";

interface StartJourneyProps {
  onJourneyStarted: () => void;
  onCancel: () => void;
}

export default function StartJourney({ onJourneyStarted, onCancel }: StartJourneyProps) {
  const { mutate: sendTransaction } = useSendTransaction();
  const [entryStation, setEntryStation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  // Use refs to maintain values between renders without causing re-renders
  const lastScannedDataRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  const SCAN_COOLDOWN = 2000; // 5 seconds cooldown between scans

  const handleScan = async (result: any) => {
    if (result?.text && !isProcessingRef.current) {
      const scannedData = result.text;
      const currentTime = Date.now();

      // Check if this is a new scan and enough time has passed
      if (scannedData !== lastScannedDataRef.current && currentTime - lastScanTimeRef.current > SCAN_COOLDOWN) {
        lastScannedDataRef.current = scannedData;
        lastScanTimeRef.current = currentTime;
        try {
          await processTransaction(scannedData);
        } catch {
          isProcessingRef.current = false;
        }
      }
    }
  };

  const processTransaction = async (scannedData: string) => {
    if (isProcessingRef.current) return;

    try {
      isProcessingRef.current = true;
      setIsLoading(true);
      setShowScanner(false);
      setEntryStation(scannedData);

      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function startJourney(string memory entryStation)",
        params: [scannedData],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setEntryStation(scannedData);
          setStatusMessage("Journey started successfully!");
          setTimeout(() => {
            onJourneyStarted();
          }, 2000);
        },
        onError: (err) => {
          setStatusMessage(`Failed to start journey: ${err.message}`);
          setIsLoading(false);
          setShowScanner(true);
          isProcessingRef.current = false;
        },
      });
    } catch (error) {
      setStatusMessage("Error preparing the transaction.");
      setIsLoading(false);
      setShowScanner(true);
      isProcessingRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  return (
    <div className="p-4 bg-gray-800  rounded-lg shadow-md text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Start Journey with QR Code</h2>
        <button onClick={onCancel} disabled={isLoading} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm">
          Close
        </button>
      </div>

      {showScanner && !isLoading && (
        <QrScanner
          delay={300}
          onScan={handleScan}
          onError={(error) => {
            console.error(error);
            setStatusMessage("Error scanning QR code. Please try again.");
          }}
          style={{ width: "100%" }}
        />
      )}

      {entryStation && (
        <p className="mb-4">
          <strong>Scanned Station:</strong> {entryStation}
        </p>
      )}

      {statusMessage && <p className="mb-4 text-yellow-500">{statusMessage}</p>}

      {isLoading && <p className="text-blue-500">Processing transaction...</p>}
    </div>
  );
}
