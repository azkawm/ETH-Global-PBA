"use client";
import { useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";

export default function GetWalletInfo({ userAddress }: { userAddress: string }) {
  const { data, isPending, error } = useReadContract({
    contract: transportTrackerContract,
    method: "function wallets(address) view returns (string name, uint256 balance, uint256 milez)",
    params: [userAddress],
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ekstraksi nilai dari tuple
  const [name, balance, milez] = data || ["", BigInt(0), BigInt(0)];

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-2">Wallet Info:</h3>
      <p>Name: {name}</p>
      <p>Balance: {balance?.toString()} Tokens</p>
      <p>Milez: {milez?.toString()}</p>
    </div>
  );
}
