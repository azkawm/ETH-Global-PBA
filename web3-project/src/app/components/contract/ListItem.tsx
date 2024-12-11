"use client";
import { useEffect, useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useReadContract } from "thirdweb/react";
import { marketplaceContract, client } from "../../client"; // Pastikan sesuai konfigurasi Anda

export default function ListItems() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [itemId, setItemId] = useState("");
  const [stocks, setStocks] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Membaca daftar item dari kontrak
  const {
    data: items,
    isLoading: loadingItems,
    error: errorItems,
  } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256 id, string name, uint256 price, uint256 stocks, address seller, address owner, bool status)",
    params: [Number(itemId) || 1], // Default baca item pertama jika belum dipilih
  });

  const handleListItem = async () => {
    if (!itemId.trim() || !stocks.trim()) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus(null);

      // Siapkan transaksi untuk menambah stok item
      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function getItemReady(uint256,uint256)",
        params: [BigInt(itemId), BigInt(stocks)], // Gunakan BigInt
      });

      // Kirim transaksi
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
      <h3 className="text-lg font-bold mb-4">Manage Item Stocks</h3>

      {/* Menampilkan detail item */}
      {loadingItems ? (
        <p>Loading item details...</p>
      ) : errorItems ? (
        <p>Error loading item: {errorItems.message}</p>
      ) : (
        items && (
          <div className="mb-4">
            <p>
              <strong>Item ID:</strong> {items.id}
            </p>
            <p>
              <strong>Name:</strong> {items.name}
            </p>
            <p>
              <strong>Price:</strong> {Number(items.price) / 1e18} Tokens
            </p>
            <p>
              <strong>Stocks:</strong> {items.stocks}
            </p>
          </div>
        )
      )}

      {/* Input untuk menambah stok */}
      <div className="mb-4">
        <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Enter Item ID" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
        <input type="number" value={stocks} onChange={(e) => setStocks(e.target.value)} placeholder="Enter Stocks" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
        <button onClick={handleListItem} disabled={isLoading} className={`w-full p-2 rounded ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}>
          {isLoading ? "Adding Stocks..." : "Add Stocks"}
        </button>
      </div>

      {/* Status Umpan Balik */}
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
