"use client";

import TokenRedeem from "../../components/contract/TokenRedeem";

export default function RedeemPage() {
  return (
    <div className="min-h-screen  text-white flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redeem Rewards</h1>
        <p className="text-gray-400 mb-6">Exchange your earned rewards for Carbon Tokens.</p>
        {/* Menggunakan Komponen TokenRedeem */}
        <TokenRedeem />
      </div>
    </div>
  );
}
