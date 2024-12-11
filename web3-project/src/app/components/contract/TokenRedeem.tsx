"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { transportTrackerContract } from "../../client";

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
          alert("Tokens redeemed successfully!");
          setStatus("Redeem successful!");
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
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-bold mb-2">Token Redeem</h2>
      <p className="text-gray-400 mb-4">Redeem your rewards tokens.</p>
      <button onClick={handleRedeem} className={`px-4 py-2 font-semibold rounded-lg ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`} disabled={isLoading}>
        {isLoading ? "Redeeming..." : "Redeem Token"}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
