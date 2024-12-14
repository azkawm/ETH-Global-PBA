"use client";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useState, useEffect } from "react";
import StartJourney from "../../components/contract/StartJourney";
import CompleteJourney from "../../components/contract/CompleteJourney";
import JourneyProgress from "../../components/contract/ReadContractInfo/Journeys";
import { transportTrackerContract } from "../../client";
import { Scan, CheckCircle2 } from "lucide-react";

export default function JourneyPage() {
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || "";
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
      setIsOnProgress(Boolean(journeyData[3]));
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900/50 backdrop-blur-sm">
        <div className="text-center text-white">
          <p>Loading journey status...</p>
          <div className="spinner-border text-blue-400 animate-spin mt-4" style={{ width: "3rem", height: "3rem" }}></div>
        </div>
      </div>
    );
  }

  if (journeyError) {
    return (
      <div className="p-6 min-h-screen bg-cover" style={{ backgroundImage: "url(/img/road.jpg)" }}>
        <div className="flex justify-center items-center">
          <p className="text-red-400 font-semibold bg-slate-900/70 backdrop-blur-md p-4 rounded-lg">Error loading your journey data: {journeyError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/img/road.jpg)" }}>
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-white drop-shadow-lg">Manage Your Journey</h1>

        {/* Flex container */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center w-full max-h-full max-w-7xl">
          {/* Left Section */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-6 text-blue-400">Journey Management</h2>
            <div className="text-center">
              {!isOnProgress ? (
                <div>
                  <p className="mb-6 text-gray-200">Ready to start your journey? Tap below to begin!</p>
                  {!showStartJourney ? (
                    <button
                      onClick={() => setShowStartJourney(true)}
                      disabled={!userAddress}
                      className={`flex items-center justify-center gap-3 w-full p-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                        userAddress ? "bg-blue-500/80 hover:bg-blue-600 text-white hover:scale-105 backdrop-blur-sm" : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Scan size={24} />
                      Start Journey
                    </button>
                  ) : (
                    <StartJourney onJourneyStarted={handleJourneyStarted} onCancel={() => setShowStartJourney(false)} />
                  )}
                </div>
              ) : (
                <div>
                  <p className="mb-6 text-gray-200">You're on your journey! Complete it below.</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 mb-6">
                    <div className="bg-green-500/80 h-3 rounded-full transition-all duration-500 ease-in-out" style={{ width: "50%" }}></div>
                  </div>
                  {!showCompleteJourney ? (
                    <button
                      onClick={() => setShowCompleteJourney(true)}
                      className="flex items-center justify-center gap-3 w-full p-4 rounded-lg bg-green-500/80 hover:bg-green-600 text-white text-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                      <CheckCircle2 size={24} />
                      Complete Journey
                    </button>
                  ) : (
                    <CompleteJourney onJourneyCompleted={handleJourneyCompleted} onCancel={() => setShowCompleteJourney(false)} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-6 text-green-400">Journey Progress</h2>
            {userAddress ? (
              <div className="p-4">
                <JourneyProgress userAddress={userAddress} />
              </div>
            ) : (
              <p className="text-gray-200 text-center">Please connect your wallet to see journey progress.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
