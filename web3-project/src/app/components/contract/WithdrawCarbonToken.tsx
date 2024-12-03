"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../../client"; // Pastikan jalur ke client benar

export default function WithdrawCarbonToken() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [amount, setAmount] = useState(""); // State untuk jumlah penarikan
  const [isLoading, setIsLoading] = useState(false); // State untuk status loading
  const [status, setStatus] = useState<string | null>(null); // State untuk status transaksi

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Please enter a valid amount.");
      return;
    }

    setStatus(null); // Reset status
    setIsLoading(true); // Mulai loading

    try {
      // Konversi jumlah ke bigint
      const _amount = BigInt(amount);

      // Siapkan transaksi
      const transaction = prepareContractCall({
        contract,
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
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-bold mb-2">Withdraw Carbon Token</h2>
      <p className="text-gray-400 mb-4">Withdraw your carbon tokens by specifying the amount.</p>

      {/* Input untuk jumlah penarikan */}
      <input type="number" className="w-full px-4 py-2 mb-4 text-black rounded-lg" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isLoading} />

      {/* Tombol Withdraw */}
      <button onClick={handleWithdraw} className={`px-4 py-2 font-semibold rounded-lg ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`} disabled={isLoading || !amount}>
        {isLoading ? "Withdrawing..." : "Withdraw"}
      </button>

      {/* Menampilkan status */}
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
