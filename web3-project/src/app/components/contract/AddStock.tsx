"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { marketplaceContract } from "../../client";

export default function AddStock() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [itemId, setItemId] = useState("");
  const [stocks, setStocks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleAddStock = async () => {
    if (!itemId.trim() || !stocks.trim()) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus(null);

      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function getItemReady(uint256,uint256)",
        params: [BigInt(itemId), BigInt(stocks)],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus("Stocks added successfully!");
          setItemId("");
          setStocks("");
        },
        onError: (err) => {
          setStatus(`Error adding stocks: ${err.message}`);
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to prepare the transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-4">Add Stocks</h3>
      <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Item ID" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
      <input type="number" value={stocks} onChange={(e) => setStocks(e.target.value)} placeholder="Stocks" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
      <button onClick={handleAddStock} disabled={isLoading} className={`w-full p-2 rounded ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
        {isLoading ? "Adding..." : "Add Stocks"}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
