"use client";
import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";
import { calculateDistance } from "../../../utils/distanceCalculator";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, ArrowRight } from "lucide-react";

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
  const [cachedJourneyData, setCachedJourneyData] = useState<readonly [string, string, boolean, boolean] | null>(null);
  useEffect(() => {
    if (journeyData) {
      setCachedJourneyData(journeyData); // Cache data setelah pembacaan
    }
  }, [journeyData]);

  if (journeyLoading || rewardLoading) return <p className="text-center text-gray-300">Loading journey data...</p>;
  if (journeyError) return <p className="text-center text-red-500">Error fetching journey data: {journeyError.message}</p>;
  if (!journeyData) return <p className="text-center text-gray-400">No journey data available</p>;
  if (!cachedJourneyData) return <p>No journey data available</p>;
  const journey = {
    entryStation: journeyData[0] as string,
    exitStation: journeyData[1] as string,
    isCompleted: Boolean(journeyData[2]),
    isOnWay: Boolean(journeyData[3]),
  };
  console.log("Raw contract data:", {
    entryStation: journeyData[0],
    exitStation: journeyData[1],
    isCompleted: journeyData[2],
    isOnWay: journeyData[3],
  });
  console.log("Journey data raw:", journeyData);

  const distance = calculateDistance(journey.entryStation, journey.exitStation);
  const rewardInWei = journey.isCompleted ? BigInt(distance) * (rewardPerUnit as bigint) : BigInt(0);

  // Convert reward from Wei to Ether
  const rewardInEther = Number(rewardInWei) / 1e18;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl text-white">
      <h3 className="text-2xl font-bold text-center mb-4 text-white">Journey Information</h3>
      {journey.isCompleted ? (
        <div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle size={28} className="text-green-500" />
            <p className="text-lg font-bold text-green-500">Journey completed successfully!</p>
          </div>
          <div className="bg-gray-900/80 p-6 rounded-lg shadow-lg">
            <p className="text-xl font-semibold text-blue-400 mb-3">Journey Summary</p>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center gap-2">
                <MapPin className="text-green-400" />
                <strong>From :</strong> {journey.entryStation}
              </p>
              <p className="flex items-center gap-2">
                <ArrowRight className="text-yellow-400" />
                <strong>To :</strong> {journey.exitStation}
              </p>
              <p className="flex items-center gap-2">
                <strong>Distance :</strong> {distance} units
              </p>
              <p className="text-yellow-400 font-bold text-lg">
                <strong>Reward Earned :</strong> {rewardInEther.toFixed(0)} Milez
              </p>
            </div>
          </div>
        </div>
      ) : journey.isOnWay ? (
        <div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowRight size={28} className="text-yellow-500" />
            <p className="text-lg font-bold text-yellow-500">Journey in progress...</p>
          </div>
          <div className="bg-gray-900/80 p-6 rounded-lg shadow-lg">
            <p className="text-xl font-semibold text-blue-400 mb-2">Current Journey</p>
            <p className="text-gray-300 flex items">
              <MapPin className="text-green-400" />
              <strong>&nbsp;From :&nbsp;</strong> {journey.entryStation}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 text-lg">No active journey</p>
        </div>
      )}
    </motion.div>
  );
}
