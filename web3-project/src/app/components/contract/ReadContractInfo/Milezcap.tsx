"use client";
import { useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";
export default function MilezCap() {
  const { data, isPending, error } = useReadContract({
    contract: transportTrackerContract,
    method: "function milezCap() view returns (uint256)",
    params: [],
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Milez Cap:</h3>
      <p>{data?.toString()} Tokens</p>
    </div>
  );
}
