"use client";
import React from "react";
import { useReadContract } from "thirdweb/react";
import { marketplaceContract } from "../../client";

export default function ListItems() {
  const {
    data: totalItems,
    isPending: loadingItems,
    error: errorItems,
  } = useReadContract({
    contract: marketplaceContract,
    method: "function getCounter() view returns (uint256)", // Menggunakan getter function
    params: [],
  });

  if (loadingItems) return <p>Loading items...</p>;
  if (errorItems) return <p>Error fetching items: {errorItems.message}</p>;
  if (!totalItems || totalItems <= 0) return <p>No items found in the marketplace.</p>;

  const items = Array.from({ length: Number(totalItems) }, (_, i) => i + 1).map((id) => <SingleItem key={id} itemId={id} />);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Marketplace Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{items}</div>
    </div>
  );
}

function SingleItem({ itemId }: { itemId: number }) {
  const {
    data: item,
    isPending,
    error,
  } = useReadContract({
    contract: marketplaceContract,
    method: "function itemLists(uint256) view returns (uint256, string, uint256, uint256, address, address, bool)",
    params: [BigInt(itemId)],
  });

  if (isPending) return <div className="p-4 bg-gray-800 rounded shadow-md">Loading item {itemId}...</div>;
  if (error)
    return (
      <div className="p-4 bg-gray-800 rounded shadow-md">
        <p>
          Error loading item {itemId}: {error.message}
        </p>
      </div>
    );
  if (!item) return <div className="p-4 bg-gray-800 rounded shadow-md">Item {itemId} not found.</div>;

  const [id, name, price, stocks, seller, currentOwner, status] = item;

  return (
    <div className="p-4 bg-gray-800 rounded shadow-md">
      <p>
        <strong>Item ID:</strong> {Number(id)}
      </p>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Price:</strong> {Number(price)} Tokens
      </p>
      <p>
        <strong>Stocks:</strong> {Number(stocks)}
      </p>
      <p>
        <strong>Seller:</strong> {seller}
      </p>
      <p>
        <strong>Current Owner:</strong> {currentOwner}
      </p>
      <p>
        <strong>Status:</strong> {status ? "Sold" : "Available"}
      </p>
    </div>
  );
}
