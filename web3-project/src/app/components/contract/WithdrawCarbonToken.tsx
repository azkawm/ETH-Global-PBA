"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../client";
import { useActiveAccount } from "thirdweb/react";
import { XCircle } from "lucide-react"; // Import icon Close dari React Lucide

export default function WithdrawCarbonTokenModal({ onClose }: { onClose: () => void }) {
  const { mutate: sendTransaction } = useSendTransaction();
  const [amount, setAmount] = useState(""); // State untuk jumlah penarikan
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading
  const [status, setStatus] = useState<string | null>(null); // State untuk status transaksi
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || "";

  const { data: balance, isLoading: balanceLoading } = useReadContract({
    contract: transportTrackerContract,
    method: "function testGetBalance(address) view returns (uint256)",
    params: [userAddress],
  });

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }

    setStatus(null);
    setIsLoading(true);

    try {
      const _amount = BigInt(amount) * BigInt(1e18);

      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function withdrawCarbonToken(uint256 _amount)",
        params: [_amount],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus(`Withdraw successfully executed! Amount: ${amount} tokens.`);
          setAmount("");
        },
        onError: (err) => {
          setStatus(`Error: ${err.message}`);
        },
      });
    } catch (err) {
      console.error(err);
      setStatus("Failed to prepare the transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
      {/* Modal Container */}
      <div className="relative bg-gray-900/80 border border-gray-700/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-all duration-300">
          <XCircle size={28} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Withdraw Carbon Token</h2>

        {/* Balance Info */}
        {balanceLoading ? (
          <p className="text-center mb-6 text-gray-300">Loading balance...</p>
        ) : (
          <p className="text-center mb-6 text-lg text-gray-300">
            <span className="font-semibold text-teal-400">Your Balance:</span> {balance ? (Number(balance) / 1e18).toFixed(0) : "0"} Milez
          </p>
        )}

        {/* Input Field */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-400">Enter Amount</label>
          <input
            type="number"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Amount to withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          className={`w-full px-4 py-3 font-bold rounded-lg transition-all duration-300 ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600 hover:scale-105"}`}
          disabled={isLoading || !amount}
        >
          {isLoading ? "Withdrawing..." : "Withdraw"}
        </button>

        {/* Status */}
        {status && <p className="mt-4 text-center text-sm text-gray-300">{status}</p>}
      </div>
    </div>
  );
}
