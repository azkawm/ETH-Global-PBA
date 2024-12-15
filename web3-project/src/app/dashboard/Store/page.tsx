"use client";

import { useState, useEffect } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { marketplaceContract, tokenContract } from "../../client";
import { motion } from "framer-motion";
import { ShoppingCart, AlertCircle } from "lucide-react";

interface Item {
  id: number;
  name: string;
  price: number;
  stocks: number;
  seller: string;
  owner: string;
  status: boolean;
  imageUrl?: string;
}

export default function MarketplaceItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseStates, setPurchaseStates] = useState<{ [key: number]: { isLoading: boolean; status: string | null } }>({});
  const { mutateAsync: sendTransaction } = useSendTransaction();

  // Use useReadContract for item IDs

  const { data: item1Data, isLoading: isLoading1 } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
    params: [BigInt(5)],
  });
  const { data: item2Data, isLoading: isLoading2 } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
    params: [BigInt(6)],
  });

  const { data: item3Data, isLoading: isLoading3 } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
    params: [BigInt(7)],
  });

  const { data: item4Data, isLoading: isLoading4 } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
    params: [BigInt(8)],
  });

  useEffect(() => {
    const allItems: Item[] = [];
    const itemsData = [item1Data, item2Data, item3Data, item4Data];

    itemsData.forEach((data, index) => {
      if (data) {
        const [id, name, price, stocks, seller, owner, status] = data;
        if (name !== "" && Number(price) !== 0) {
          // Memetakan gambar sesuai urutan item
          const imageUrls = ["/img/hoodie.webp", "/img/tumbler.webp", "/img/backpack.webp", "/img/umbrella.webp"];

          allItems.push({
            id: Number(id),
            name: name,
            price: Number(price),
            stocks: Number(stocks),
            seller: seller.toString(),
            owner: owner.toString(),
            status: status,
            imageUrl: imageUrls[index] || "/img/default.png",
          });
        }
      }
    });

    setItems(allItems);
  }, [item1Data, item2Data]);

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;

  const handlePurchase = async (item: Item) => {
    setPurchaseStates((prev) => ({
      ...prev,
      [item.id]: { isLoading: true, status: "Processing approval..." },
    }));

    try {
      // Approve token transfer
      const approveTransaction = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address,uint256)",
        params: [marketplaceContract.address, BigInt(item.price)],
      });

      await sendTransaction(approveTransaction);

      // Update state to show approval is done
      setPurchaseStates((prev) => ({
        ...prev,
        [item.id]: { isLoading: true, status: "Approval complete. Processing purchase..." },
      }));

      // Purchase item
      const purchaseTransaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function purchaseItemsWithToken(uint256)",
        params: [BigInt(item.id)],
      });

      await sendTransaction(purchaseTransaction);

      setPurchaseStates((prev) => ({
        ...prev,
        [item.id]: { isLoading: false, status: "Purchase successful!" },
      }));
    } catch (error) {
      setPurchaseStates((prev) => ({
        ...prev,
        [item.id]: { isLoading: false, status: "Transaction failed. Please try again." },
      }));
    }
  };

  if (isLoading) return <p className="text-center text-gray-300">Loading items...</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">Milez Collective</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center"
            >
              {item.imageUrl && (
                <div className="relative w-full flex items-center justify-center border border-gray-600 rounded-md overflow-hidden max-w-[200px] mx-auto">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-auto object-contain" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-blue-400 my-2 text-center">{item.name}</h2>
              <p className="text-gray-300 text-center">Price: {Number(item.price) / 1e18} Milez</p>
              <p className="text-gray-300 text-center">Stocks: {item.stocks}</p>
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
