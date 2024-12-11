"use client";
import { useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";
import { calculateDistance } from "../../../utils/distanceCalculator";

export default function JourneyProgress({ userAddress }: { userAddress: string }) {
  const {
    data: journeyData,
    isPending: journeyLoading,
    error: journeyError,
  } = useReadContract({
    contract: transportTrackerContract,
    method: "function journeys(address) view returns (string entryStation, string exitStation, bool isCompleted, bool isOnWay)",
    params: [userAddress],
  });

  const { data: rewardPerUnit, isPending: rewardLoading } = useReadContract({
    contract: transportTrackerContract,
    method: "function rewardPerUnit() view returns (uint256)",
    params: [],
  });

  if (journeyLoading || rewardLoading) return <p>Loading journey data...</p>;
  if (journeyError) return <p>Error fetching journey data: {journeyError.message}</p>;
  if (!journeyData) return <p>No journey data available</p>;

  const journey = {
    entryStation: journeyData[0] as string,
    exitStation: journeyData[1] as string,
    isCompleted: Boolean(Number(journeyData[2])),
    isOnWay: Boolean(Number(journeyData[3])),
  };

  const distance = calculateDistance(journey.entryStation, journey.exitStation);
  const rewardInWei = journey.isCompleted ? BigInt(distance) * (rewardPerUnit as bigint) : BigInt(0);

  // Convert reward from Wei to Ether
  const rewardInEther = Number(rewardInWei) / 1e18;

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-2">Journey Information</h3>
      {journey.isCompleted ? (
        <div>
          <p className="text-green-500 mb-4">Journey completed successfully!</p>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-xl font-bold mb-2">Journey Summary</p>
            <p>
              <strong>From:</strong> {journey.entryStation}
            </p>
            <p>
              <strong>To:</strong> {journey.exitStation}
            </p>
            <p>
              <strong>Distance:</strong> {distance} units
            </p>
            <p>
              <strong>Reward Earned:</strong> {rewardInEther.toFixed(0)} Milez
            </p>
          </div>
        </div>
      ) : journey.isOnWay ? (
        <div>
          <p className="text-yellow-500">Journey in progress</p>
          <p>
            <strong>From:</strong> {journey.entryStation}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">No active journey</p>
      )}
    </div>
  );
}
