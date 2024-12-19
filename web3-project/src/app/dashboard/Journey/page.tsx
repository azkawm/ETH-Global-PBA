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
    setShowStartJourney(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900/50 backdrop-blur-sm w-full">
        <div className="text-center text-white">
          <p>Loading journey status...</p>
          <div className="animate-spin mt-4 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen h-full bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-white flex items-center justify-center overflow-hidden py-8">
      {/* Radial Gradient */}
      <div className="absolute inset-0 min-h-full bg-gradient-radial from-blue-500/20 via-teal-300/20 to-purple-600/5"></div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 mt-4 drop-shadow-lg">Manage Your Journey</h1>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center w-full">
          {/* Left Section */}
          <div className="flex-1 min-w-0 bg-slate-900/40 backdrop-blur-md p-4 md:p-8 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-4 md:mb-6 text-blue-400">Journey Management</h2>
            <div className="text-center">
              {!isOnProgress ? (
                <div>
                  <p className="mb-4 md:mb-6 text-gray-200">Ready to start your journey? Tap below to begin!</p>
                  {!showStartJourney ? (
                    <button
                      onClick={() => setShowStartJourney(true)}
                      disabled={!userAddress}
                      className={`flex items-center justify-center gap-3 w-full p-3 md:p-4 rounded-lg text-base md:text-lg font-medium transition-all duration-300 ${
                        userAddress ? "bg-blue-500/80 hover:bg-blue-600 text-white hover:scale-105" : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Scan size={20} className="md:w-6 md:h-6" />
                      Start Journey
                    </button>
                  ) : (
                    <StartJourney onJourneyStarted={handleJourneyStarted} onCancel={() => setShowStartJourney(false)} />
                  )}
                </div>
              ) : (
                <div>
                  <p className="mb-4 md:mb-6 text-gray-200">You're on your journey! Complete it below.</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 md:h-3 mb-4 md:mb-6">
                    <div className="bg-green-500/80 h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: "50%" }}></div>
                  </div>
                  {!showCompleteJourney ? (
                    <button
                      onClick={() => setShowCompleteJourney(true)}
                      className="flex items-center justify-center gap-3 w-full p-3 md:p-4 rounded-lg bg-green-500/80 hover:bg-green-600 text-white text-base md:text-lg font-medium transition-all duration-300 hover:scale-105"
                    >
                      <CheckCircle2 size={20} className="md:w-6 md:h-6" />
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
          <div className="flex-1 min-w-0 bg-slate-900/40 backdrop-blur-md p-4 md:p-8 rounded-xl border border-white/10 shadow-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-4 md:mb-6 text-green-400">Journey Progress</h2>
            {userAddress ? (
              <div className="p-2 md:p-4">
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
