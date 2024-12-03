"use client";
import { useReadContract } from "thirdweb/react";
import { contract } from "../../../client";
export default function RewardPerUnit() {
  const { data, isPending, error } = useReadContract({
    contract,
    method: "function rewardPerUnit() view returns (uint256)",
    params: [],
  });

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Reward Per Unit:</h3>
      <p>{data?.toString()} Tokens</p>
    </div>
  );
}
