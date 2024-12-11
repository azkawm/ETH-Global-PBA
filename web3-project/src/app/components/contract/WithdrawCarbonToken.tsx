"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../client"; // Sesuaikan jalur impor
import { useActiveAccount } from "thirdweb/react";

export default function WithdrawCarbonTokenModal({ onClose }: { onClose: () => void }) {
  const { mutate: sendTransaction } = useSendTransaction();
  const [amount, setAmount] = useState(""); // State untuk jumlah penarikan
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading
  const [status, setStatus] = useState<string | null>(null); // State untuk status transaksi
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || "";

  // Membaca balance dari kontrak menggunakan fungsi `storage_.getBalance`
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    contract: transportTrackerContract,
    method: "function testGetBalance(address) view returns (uint256)", // Ganti dengan fungsi testGetBalance
    params: [userAddress],
  });

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }

    setStatus(null); // Reset status
    setIsLoading(true); // Mulai loading

    try {
      // Konversi jumlah ke bigint
      const _amount = BigInt(amount) * BigInt(1e18); // Konversi ke Wei

      // Siapkan transaksi
      const transaction = prepareContractCall({
        contract: transportTrackerContract,
        method: "function withdrawCarbonToken(uint256 _amount)",
        params: [_amount],
      });

      // Kirim transaksi
      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus(`Withdraw successfully executed! Amount: ${amount} tokens.`);
          setAmount(""); // Reset input setelah transaksi berhasil
        },
        onError: (err) => {
          setStatus(`Error: ${err.message}`);
        },
      });
    } catch (err) {
      console.error(err);
      setStatus("Failed to prepare the transaction.");
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Withdraw Carbon Token</h2>
        {balanceLoading ? (
          <p>Loading balance...</p>
        ) : (
          <p className="mb-4">
            <strong>Your Balance:</strong> {balance ? (Number(balance) / 1e18).toFixed(0) : "0"} Milez
          </p>
        )}

        {/* Input untuk jumlah penarikan */}
        <input type="number" className="w-full px-4 py-2 mb-4 text-black rounded-lg" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isLoading} />

        {/* Tombol Withdraw */}
        <button onClick={handleWithdraw} className={`w-full px-4 py-2 font-semibold rounded-lg ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`} disabled={isLoading || !amount}>
          {isLoading ? "Withdrawing..." : "Withdraw"}
        </button>

        {/* Menampilkan status */}
        {status && <p className="mt-4 text-sm">{status}</p>}

        {/* Tombol untuk menutup modal */}
        <button onClick={onClose} className="mt-4 w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
}
