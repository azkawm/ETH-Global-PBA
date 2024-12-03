"use client";
import { useReadContract } from "thirdweb/react";
import { contract } from "../../../client";

export default function CalculateReward({ distance }: { distance: number }) {
  const { data, isPending, error } = useReadContract({
    contract,
    method: "function calculateReward(uint256 distance) view returns (uint256)",
    params: [BigInt(distance)], // Konversi ke BigInt jika diperlukan
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Reward:</h3>
      <p>{data?.toString()} Tokens</p>
    </div>
  );
}
