"use client";

import { useState, useEffect } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { marketplaceContract, tokenContract } from "../../../client";
import { motion } from "framer-motion";
import { Package, ShoppingCart, AlertCircle } from "lucide-react";
import { UseQueryResult } from "@tanstack/react-query";

// Struktur data Item
interface Item {
  id: number;
  name: string;
  price: number;
  stocks: number;
  seller: string;
  owner: string;
  status: boolean;
}

export default function MarketplaceItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseStates, setPurchaseStates] = useState<{ [key: number]: { isLoading: boolean; status: string | null } }>({});
  const { mutate: sendTransaction } = useSendTransaction();

  const fetchAllItems = async () => {
    setLoading(true);
    const itemPromises: Promise<Item | null>[] = [];
    const maxItems = 10; // Asumsi maksimal 10 item

    for (let i = 1; i <= maxItems; i++) {
      const itemPromise = new Promise<Item | null>(async (resolve) => {
        try {
          const result: UseQueryResult<readonly [bigint, string, bigint, bigint, string, string, boolean]> = await useReadContract({
            contract: marketplaceContract,
            method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
            params: [BigInt(i)],
          });

          // Check if result exists and has data
          if (result && result.data) {
            const [id, name, price, stocks, seller, owner, status] = result.data;
            resolve({
              id: Number(id),
              name: name,
              price: Number(price),
              stocks: Number(stocks),
              seller: seller,
              owner: owner,
              status: status,
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error(`Error fetching item ${i}:`, error);
          resolve(null);
        }
      });

      itemPromises.push(itemPromise);
    }

    const results = await Promise.all(itemPromises);
    const validItems = results.filter((item): item is Item => item !== null);

    setItems(validItems);

    // Initialize purchase states for each item
    const initialPurchaseStates = validItems.reduce((acc: Record<number, { isLoading: boolean; status: string | null }>, item) => {
      acc[item.id] = { isLoading: false, status: null };
      return acc;
    }, {});
    setPurchaseStates(initialPurchaseStates);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const handlePurchase = async (item: Item) => {
    // Update purchase state for this specific item
    setPurchaseStates((prev) => ({
      ...prev,
      [item.id]: { ...prev[item.id], isLoading: true, status: null },
    }));

    try {
      // First, approve the token transfer
      const approveTransaction = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address,uint256)",
        params: [marketplaceContract.address, BigInt(item.price)],
      });

      sendTransaction(approveTransaction, {
        onSuccess: () => {
          // If approval successful, proceed with purchase
          const purchaseTransaction = prepareContractCall({
            contract: marketplaceContract,
            method: "function purchaseItemsWithToken(uint256)",
            params: [BigInt(item.id)],
          });

          sendTransaction(purchaseTransaction, {
            onSuccess: () => {
              setPurchaseStates((prev) => ({
                ...prev,
                [item.id]: { isLoading: false, status: "Purchase successful!" },
              }));
              // Optionally refresh items list
              fetchAllItems();
            },
            onError: (err: Error) => {
              setPurchaseStates((prev) => ({
                ...prev,
                [item.id]: { isLoading: false, status: `Purchase failed: ${err.message}` },
              }));
            },
          });
        },
        onError: (err: Error) => {
          setPurchaseStates((prev) => ({
            ...prev,
            [item.id]: { isLoading: false, status: `Token approval failed: ${err.message}` },
          }));
        },
      });
    } catch (error) {
      setPurchaseStates((prev) => ({
        ...prev,
        [item.id]: { isLoading: false, status: "An unexpected error occurred." },
      }));
    }
  };

  if (loading) return <p className="text-center text-gray-300">Loading items...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">Marketplace Items</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-800/90 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="absolute -top-5 -right-5 bg-blue-500 p-3 rounded-full shadow-md">
                <Package size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-blue-400 mb-2">{item.name}</h2>
              <p className="text-gray-300">Price: {item.price} Tokens</p>
              <p className="text-gray-300">Stocks: {item.stocks}</p>
              <p className="text-gray-300">
                Seller: {item.seller.slice(0, 8)}...{item.seller.slice(-4)}
              </p>
              <button
                onClick={() => handlePurchase(item)}
                disabled={item.stocks === 0 || purchaseStates[item.id]?.isLoading}
                className={`mt-4 w-full text-white py-2 rounded-lg flex items-center justify-center ${item.stocks === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
              >
                {purchaseStates[item.id]?.isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <ShoppingCart size={20} className="inline mr-2" />
                    Purchase
                  </>
                )}
              </button>
              {purchaseStates[item.id]?.status && (
                <div className={`mt-2 text-sm flex items-center ${purchaseStates[item.id]?.status?.includes("failed") ? "text-red-400" : "text-green-400"}`}>
                  <AlertCircle size={16} className="mr-2" />
                  {purchaseStates[item.id]?.status}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No items available at the moment.</p>
      )}
    </div>
  );
}
