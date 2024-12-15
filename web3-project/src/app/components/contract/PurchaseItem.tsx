// PurchaseItem.js
import React, { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { marketplaceContract, tokenContract } from "../../client";

export default function PurchaseItem() {
  const [itemId, setItemId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { mutate: sendTransaction } = useSendTransaction();

  const handlePurchase = async () => {
    if (!itemId.trim()) {
      setStatus("Please enter an item ID.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus(null);

      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method: "function purchaseItemsWithToken(uint256)",
        params: [BigInt(itemId)],
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          setStatus("Purchase successful!");
          setItemId("");
        },
        onError: (err) => {
          setStatus(`Purchase failed: ${err.message}`);
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setStatus("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveToken = async () => {
    try {
      setIsLoading(true);
      setStatus(null);

      const transaction = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address,uint256)",
        params: [marketplaceContract.address, BigInt(itemId) * BigInt(10000000000000000)], // Adjust the price as needed
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          handlePurchase();
        },
        onError: (err) => {
          setStatus(`Approval failed: ${err.message}`);
        },
      });
    } catch (error) {
      console.error("Error approving token:", error);
      setStatus("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-4">Purchase Item</h3>
      <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Enter Item ID" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
      <button onClick={handleApproveToken} disabled={isLoading} className={`w-full p-2 rounded ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
        {isLoading ? "Purchasing..." : "Purchase"}
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}
