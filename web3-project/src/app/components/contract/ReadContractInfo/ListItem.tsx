"use client";
import React, { useEffect, useState } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { marketplaceContract } from "../../../client";

export default function StorePage() {
  const [items, setItems] = useState<{ id: string; name: string; price: string; stocks: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { mutate: sendTransaction } = useSendTransaction();
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  // Fetch items from contract
  const fetchItems = async () => {
    setLoading(true);
    try {
      const itemsList: { id: string; name: string; price: string; stocks: string; status: string }[] = [];
      for (let i = 1; i <= 10; i++) {
        // Menggunakan useReadContract untuk membaca detail item
        const { data: item, error } = useReadContract({
          contract: marketplaceContract,
          method: "function itemLists(uint256) view returns (uint256 id, string name, uint256 price, uint256 stocks, address seller, address owner, bool status)",
          params: [BigInt(i)], // Parameter ID item
        });

        if (error) {
          console.error(`Failed to fetch item ID ${i}:`, error);
          continue;
        }

        // Destructuring untuk mengakses elemen tuple
        if (item) {
          const [id, name, price, stocks, , , status] = item;
          itemsList.push({
            id: id.toString(),
            name: name,
            price: (BigInt(price) / BigInt(1e18)).toString(), // Konversi harga ke token
            stocks: stocks.toString(),
            status: status ? "Sold" : "Available",
          });
        }
      }
      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle item purchase
  const handlePurchase = async (itemId: string) => {
    try {
      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function purchaseItems(uint256)",
        params: [BigInt(itemId)],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setPurchaseStatus("Purchase successful!");
          fetchItems(); // Refresh items after purchase
        },
        onError: (err) => {
          setPurchaseStatus(`Failed to purchase: ${err.message}`);
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setPurchaseStatus("Failed to prepare the transaction.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Store</h1>
      {loading ? (
        <p>Loading items...</p>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 bg-gray-800 rounded shadow-md">
              <p>
                <strong>Item ID:</strong> {item.id}
              </p>
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Price:</strong> {item.price} Tokens
              </p>
              <p>
                <strong>Stocks:</strong> {item.stocks}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              <button className="mt-4 bg-purple-500 text-white p-2 rounded hover:bg-purple-600" onClick={() => handlePurchase(item.id)}>
                Buy Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No items available.</p>
      )}
      {purchaseStatus && <p className="mt-4 text-sm">{purchaseStatus}</p>}
    </div>
  );
}
