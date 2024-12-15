"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { transportTrackerContract } from "../../client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function TokenRedeem() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [status, setStatus] = useState<string | null>(null); // State untuk status transaksi

  const handleRedeem = async () => {
    setStatus(null); // Reset status sebelum memulai
    setIsLoading(true); // Mulai loading

    try {
      // Siapkan transaksi ke kontrak pintar
      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function tokenRedeem()",
        params: [],
      });

      // Kirim transaksi
      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus("Tokens redeemed successfully!");
        },
        onError: (err) => {
          console.error("Redeem failed:", err);
          setStatus(`Redeem failed: ${err.message}`);
        },
      });
    } catch (err) {
      console.error("Failed to prepare transaction:", err);
      setStatus("Failed to prepare the transaction.");
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-700/60 rounded-xl border border-gray-600 shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold text-center">Token Redeem</h2>
      <p className="text-gray-300 text-center">Redeem your rewards tokens into valuable assets.</p>

      {/* Button */}
      <button
        onClick={handleRedeem}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600 hover:scale-105"}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />
            Redeeming...
          </span>
        ) : (
          "Redeem Token"
        )}
      </button>

      {/* Status Feedback */}
      {status && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-lg font-medium w-full ${status.includes("failed") ? "bg-red-500/20 text-red-400 border border-red-600" : "bg-green-500/20 text-green-400 border border-green-600"}`}>
          {status.includes("failed") ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
          {status}
        </div>
      )}
    </div>
  );
}
