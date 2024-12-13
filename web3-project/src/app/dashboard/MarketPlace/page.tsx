"use client";
import React from "react";
import AddItem from "../../components/contract/AddItem";
import AddStock from "../../components/contract/AddStock";

export default function MarketplacePage() {
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Marketplace - Manage Items</h1>
      <AddItem />
      <AddStock />
    </div>
  );
}
