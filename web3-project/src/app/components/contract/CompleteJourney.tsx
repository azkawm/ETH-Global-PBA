"use client";
import { useState, useEffect, useRef } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import QrScanner from "react-qr-scanner";
import { transportTrackerContract } from "../../client";

interface CompleteJourneyProps {
  onJourneyCompleted: () => void;
  onCancel: () => void;
}

export default function CompleteJourney({ onJourneyCompleted, onCancel }: CompleteJourneyProps) {
  const { mutate: sendTransaction } = useSendTransaction();
  const [exitStation, setExitStation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(true);

  // Use refs to maintain values between renders
  const lastScannedDataRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);

  const SCAN_COOLDOWN = 5000; // 5 seconds cooldown between scans

  const handleScan = async (result: any) => {
    if (result?.text && !isProcessingRef.current) {
      const scannedData = result.text;
      const currentTime = Date.now();

      // Check if this is a new scan and enough time has passed
      if (scannedData !== lastScannedDataRef.current && currentTime - lastScanTimeRef.current > SCAN_COOLDOWN) {
        lastScannedDataRef.current = scannedData;
        lastScanTimeRef.current = currentTime;
        await processTransaction(scannedData);
      }
    }
  };

  const processTransaction = async (scannedData: string) => {
    if (isProcessingRef.current) return;

    try {
      isProcessingRef.current = true;
      setIsLoading(true);
      setShowScanner(false);
      setExitStation(scannedData);
      setStatusMessage("Processing transaction...");

      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function completeJourney(string memory exitStation)",
        params: [scannedData],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setStatusMessage("Journey completed successfully!");
          setTimeout(() => {
            onJourneyCompleted();
          }, 2000);
        },
        onError: (err) => {
          setStatusMessage(`Failed to complete journey: ${err.message}`);
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

  // Handle QR scan errors
  const handleScanError = (error: any) => {
    if (error) {
      console.error("QR Scan Error:", error);
      setStatusMessage("Error scanning QR code. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Complete Journey with QR Code</h2>
        <button onClick={onCancel} disabled={isLoading} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm">
          Close
        </button>
      </div>

      {showScanner && (
        <div className="mb-4">
          <QrScanner
            delay={300} // Delay untuk scanning
            onScan={handleScan} // Fungsi saat berhasil scan
            onError={handleScanError} // Fungsi error
            style={{ width: "100%" }} // Gaya scanner
          />
        </div>
      )}

      {exitStation && (
        <p className="mb-4">
          <strong>Exit Station:</strong> {exitStation}
        </p>
      )}

      {statusMessage && <p className={`mb-4 ${statusMessage.includes("Error") || statusMessage.includes("Failed") ? "text-red-500" : "text-yellow-500"}`}>{statusMessage}</p>}

      {isLoading && <p className="text-blue-500">Processing transaction...</p>}
    </div>
  );
}
