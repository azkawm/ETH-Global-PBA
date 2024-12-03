"use client";
import { useReadContract } from "thirdweb/react";
import { contract } from "../../../client";

export default function GetJourneyInfo({ userAddress }: { userAddress: string }) {
  const { data, isPending, error } = useReadContract({
    contract,
    method: "function journeys(address) view returns (string entryStation, string exitStation, uint256 reward, bool isCompleted)",
    params: [userAddress],
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Ekstraksi nilai dari tuple
  const [entryStation, exitStation, reward, isCompleted] = data || ["", "", BigInt(0), false];

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-2">Journey Info:</h3>
      <p>Entry Station: {entryStation}</p>
      <p>Exit Station: {exitStation}</p>
      <p>Reward: {reward?.toString()} Tokens</p>
      <p>Is Completed: {isCompleted ? "Yes" : "No"}</p>
    </div>
  );
}
