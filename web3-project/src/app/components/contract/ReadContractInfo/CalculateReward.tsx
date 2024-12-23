"use client";
import { useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";

export default function CalculateReward({ distance }: { distance: number }) {
  const { data, isPending, error } = useReadContract({
    contract: transportTrackerContract,
    method: "function calculateReward(uint256 distance) view returns (uint256)",
    params: [BigInt(distance)], // Konversi ke BigInt jika diperlukan
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Konversi dari wei ke token penuh
  const formattedReward = data ? (Number(data) / 1e18).toFixed(2) : "0";

  return (
    <div>
      <h3>Reward:</h3>
      <p>{formattedReward} Tokens</p> {/* Tampilkan reward dalam format yang lebih jelas */}
    </div>
  );
}
