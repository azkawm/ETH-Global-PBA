"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { transportTrackerContract } from "../../client";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function TokenRedeem() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false); // State loading
  const [status, setStatus] = useState<string | null>(null); // State status transaksi

  const handleRedeem = async () => {
    setStatus(null);
    setIsLoading(true);

    try {
      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function tokenRedeem()",
        params: [],
      });

      sendTransaction(transaction, {
        onSuccess: () => setStatus("Tokens redeemed successfully!"),
        onError: (err) => setStatus(`Redeem failed: ${err.message}`),
      });
    } catch (err) {
      console.error("Transaction error:", err);
      setStatus("Failed to prepare the transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* Button */}
      <button
        onClick={handleRedeem}
        className={`w-full px-6 py-3 rounded-full font-semibold text-white text-lg transition-all duration-300 shadow-lg ${
          isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 active:scale-95"
        }`}
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
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-3 text-lg font-medium w-full transition-all duration-300 ${
            status.includes("failed") ? "bg-red-500/20 text-red-400 border border-red-600" : "bg-green-500/20 text-green-400 border border-green-600"
          }`}
        >
          {status.includes("failed") ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
          {status}
        </div>
      )}
    </div>
  );
}
