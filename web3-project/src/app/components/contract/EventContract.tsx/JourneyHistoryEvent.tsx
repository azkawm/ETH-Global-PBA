"use client";
import { calculateDistance } from "../../../utils/distanceCalculator";
import { prepareEvent } from "thirdweb";
import { useContractEvents, useActiveAccount } from "thirdweb/react";
import { transportTrackerContract } from "../../../client";
import { motion } from "framer-motion";
import { Award, MapPin, User } from "lucide-react";

// Prepare events for JourneyStarted and JourneyCompleted
const journeyStartedEvent = prepareEvent({
  signature: "event JourneyStarted(address indexed passenger, string entryStation)",
});

const journeyCompletedEvent = prepareEvent({
  signature: "event JourneyCompleted(address indexed passenger, string exitStation, uint256 fare)",
});

export default function JourneyHistory() {
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || ""; // Mendapatkan alamat pengguna aktif

  const { data: startedEvents } = useContractEvents({
    contract: transportTrackerContract,
    events: [journeyStartedEvent],
  });

  const {
    data: completedEvents,
    isLoading,
    error,
  } = useContractEvents({
    contract: transportTrackerContract,
    events: [journeyCompletedEvent],
  });

  if (isLoading) return <p className="text-center text-gray-300">Loading journey history...</p>;
  if (error) return <p className="text-red-400">Error loading events: {error.message}</p>;

  // Filter events based on the active user's address
  const filteredCompletedEvents = completedEvents?.filter((event: any) => event.args.passenger === userAddress);

  const combinedHistory = filteredCompletedEvents?.map((completedEvent: any) => {
    const { passenger, exitStation } = completedEvent.args;
    const startedEvent = startedEvents?.find((event: any) => event.args.passenger === passenger);
    const entryStation = startedEvent ? startedEvent.args.entryStation : "Unknown";

    // Hitung distance dan gunakan sebagai reward
    const distance = calculateDistance(entryStation, exitStation);

    return {
      passenger,
      entryStation,
      exitStation,
      reward: distance, // Gunakan distance sebagai reward
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">Journey History</h1>
      {combinedHistory && combinedHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combinedHistory.map((history: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-lg border border-gray-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="absolute -top-5 -right-5 bg-blue-500 p-3 rounded-full shadow-md">
                <Award size={28} className="text-white" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-700 p-3 rounded-full">
                  <User size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-400">Journey #{index + 1}</h3>
              </div>
              <div className="text-gray-300 space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="text-green-400" /> <strong>Entry Station:</strong> {history.entryStation}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="text-red-400" /> <strong>Exit Station:</strong> {history.exitStation}
                </p>
                <p className="text-yellow-400 font-semibold text-lg">Reward Earned: {history.reward} Milez</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No journey history found for the active account.</p>
      )}
    </div>
  );
}
