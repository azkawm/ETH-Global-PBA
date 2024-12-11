"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { marketplaceContract } from "../../client"; // Pastikan import sesuai dengan konfigurasi Anda

export default function AddItem() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleAddItem = async () => {
    if (!name.trim() || !price.trim()) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus(null);

      // Siapkan transaksi dengan prepareContractCall
      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function listingItems(string,uint256)",
        params: [name, BigInt(price) * BigInt(1e18)], // Konversi harga ke Wei
      });

      // Kirim transaksi
      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus("Item added successfully!");
          setName("");
          setPrice("");
        },
        onError: (err) => {
          setStatus(`Error adding item: ${err.message}`);
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
      <h3 className="text-lg font-bold mb-4">Add New Item</h3>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item Name" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (in Tokens)" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
      <button onClick={handleAddItem} disabled={isLoading} className={`w-full p-2 rounded ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
        {isLoading ? "Adding..." : "Add Item"}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
