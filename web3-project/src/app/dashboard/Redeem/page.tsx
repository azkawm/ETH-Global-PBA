"use client";

import TokenRedeem from "../../components/contract/TokenRedeem";

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white flex items-center justify-center relative">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-teal-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl bg-gray-800/90 backdrop-blur-lg p-12 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">Redeem Your Rewards</h1>
        <p className="text-lg text-gray-300 text-center mb-8">Exchange your earned rewards for valuable Carbon Tokens and make the most of your sustainability journey.</p>

        {/* Token Redeem Section */}
        <div className="flex justify-center">
          <TokenRedeem />
        </div>
      </div>
    </div>
  );
}
