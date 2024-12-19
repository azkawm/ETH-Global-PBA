"use client";

import TokenRedeem from "../../components/contract/TokenRedeem";

export default function RedeemPage() {
  return (
    <div className="relative min-h-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white flex items-center justify-center overflow-hidden">
      {/* Centered Gradient Background */}
      <div className="absolute inset-0 min-h-screen h-full bg-gradient-radial from-blue-500/20 via-teal-300/20 to-purple-600/5"></div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main Content */}
      <div className="relative w-full max-w-lg bg-gray-800/60 backdrop-blur-md p-12 m-12 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">Redeem Your Rewards</h1>
        <p className="text-lg text-gray-300 text-center mb-8">Exchange your earned rewards for valuable Carbon Tokens and make the most of your sustainability journey.</p>

        {/* Token Redeem Section */}
        <div className="flex justify-center">
          <TokenRedeem />
        </div>
      </div>
    </div>
  );
}
