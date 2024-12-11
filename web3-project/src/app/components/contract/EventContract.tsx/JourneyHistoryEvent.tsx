"use client";
import { calculateDistance } from "../../../utils/distanceCalculator";
import { prepareEvent } from "thirdweb";
import { useContractEvents, useActiveAccount } from "thirdweb/react";
import { contract } from "../../../client"; // Pastikan jalur ke client benar

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

  const {
    data: startedEvents,
    isLoading: loadingStarted,
    error: errorStarted,
  } = useContractEvents({
    contract,
    events: [journeyStartedEvent],
  });

  const {
    data: completedEvents,
    isLoading: loadingCompleted,
    error: errorCompleted,
  } = useContractEvents({
    contract,
    events: [journeyCompletedEvent],
  });

  if (loadingStarted || loadingCompleted) return <p>Loading journey history...</p>;
  if (errorStarted || errorCompleted) return <p>Error loading events: {errorStarted?.message || errorCompleted?.message}</p>;

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
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-xl font-bold mb-4">Journey History</h3>
      {combinedHistory && combinedHistory.length > 0 ? (
        <div className="flex flex-col gap-4">
          {combinedHistory.map((history: any, index: number) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md" style={{ width: "100%" }}>
              <p>
                <strong>Passenger:</strong> {history.passenger}
              </p>
              <p>
                <strong>Entry Station:</strong> {history.entryStation}
              </p>
              <p>
                <strong>Exit Station:</strong> {history.exitStation}
              </p>
              <p>
                <strong>Reward Earned:</strong> {history.reward} Milez
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No journey history found for the active account.</p>
      )}
    </div>
  );
}
