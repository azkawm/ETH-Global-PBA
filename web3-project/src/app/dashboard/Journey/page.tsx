"use client";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useState, useEffect } from "react";
import StartJourney from "../../components/contract/StartJourney";
import CompleteJourney from "../../components/contract/CompleteJourney";
import JourneyProgress from "../../components/contract/ReadContractInfo/Journeys";
import RewardPerUnit from "../../components/contract/ReadContractInfo/RewardPerUnit";
import CalculateReward from "../../components/contract/ReadContractInfo/CalculateReward";
import { transportTrackerContract } from "../../client";

export default function JourneyPage() {
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || "";
  const [distance, setDistance] = useState<number | null>(null);
  const [isOnProgress, setIsOnProgress] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStartJourney, setShowStartJourney] = useState(false);
  const [showCompleteJourney, setShowCompleteJourney] = useState(false);

  const { data: journeyData, error: journeyError } = useReadContract({
    contract: transportTrackerContract,
    method: "function journeys(address) view returns (string entryStation, string exitStation, bool isCompleted, bool isOnWay)",
    params: [userAddress],
  });

  useEffect(() => {
    if (journeyData) {
      const isOnWay = Boolean(journeyData[3]);
      setIsOnProgress(isOnWay);
      setLoading(false);
    } else if (journeyError) {
      console.error("Error fetching journey data:", journeyError.message);
      setLoading(false);
    }
  }, [journeyData, journeyError]);

  const handleJourneyStarted = () => {
    setIsOnProgress(true);
    setShowStartJourney(false);
  };

  const handleJourneyCompleted = () => {
    setIsOnProgress(false);
    setShowCompleteJourney(false);
  };

  if (loading) {
    return <p className="text-center text-gray-700">Loading journey status...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Journey</h1>

      {/* Centered Journey Management Section */}
      <div className="max-w-md mx-auto mb-8">
        {!isOnProgress ? (
          <div className="p-4 border rounded-lg shadow bg-white">
            {!showStartJourney ? (
              <button onClick={() => setShowStartJourney(true)} disabled={!userAddress} className={`w-full p-2 rounded ${userAddress ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-500 cursor-not-allowed text-gray-300"}`}>
                Start Journey
              </button>
            ) : (
              <StartJourney onJourneyStarted={handleJourneyStarted} onCancel={() => setShowStartJourney(false)} />
            )}
          </div>
        ) : (
          <div className="p-4 border rounded-lg shadow bg-white">
            {!showCompleteJourney ? (
              <button onClick={() => setShowCompleteJourney(true)} className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded">
                Complete Journey
              </button>
            ) : (
              <CompleteJourney onJourneyCompleted={handleJourneyCompleted} onCancel={() => setShowCompleteJourney(false)} />
            )}
          </div>
        )}
      </div>

      {/* Journey Progress Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Journey Progress</h2>
        {userAddress ? <JourneyProgress userAddress={userAddress} /> : <p className="text-gray-700">Please connect your wallet to see journey progress.</p>}
      </div>

      {/* Reward Calculation Section */}
      <div className="p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Calculate Your Reward</h2>
        <RewardPerUnit />
        <div className="my-4">
          <label htmlFor="distance" className="block text-lg mb-2">
            Enter Distance (in km):
          </label>
          <input id="distance" type="number" value={distance ?? ""} onChange={(e) => setDistance(Number(e.target.value))} className="p-2 border rounded w-full" placeholder="Enter distance" />
        </div>
        {distance !== null && <CalculateReward distance={distance} />}
      </div>
    </div>
  );
}
