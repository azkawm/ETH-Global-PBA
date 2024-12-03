"use client";

import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";
import { contract } from "../../../client"; // Pastikan jalur ke client benar

const preparedEvent = prepareEvent({
  signature: "event JourneyCompleted(address indexed passenger, string exitStation, uint256 fare)",
});

export default function JourneyCompletedEvent() {
  const {
    data: events,
    isLoading,
    error,
  } = useContractEvents({
    contract,
    events: [preparedEvent],
  });

  if (isLoading) return <p>Loading JourneyCompleted events...</p>;
  if (error) return <p>Error loading JourneyCompleted events: {error.message}</p>;

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-2">JourneyCompleted Events</h3>
      <ul>
        {events && events.length > 0 ? (
          events.map((event: any, index: number) => {
            const args = event.args; // Destructuring array
            const passenger = args[0]; // Address
            const exitStation = args[1]; // Exit Station
            const fare = args[2]; // Fare

            return (
              <li key={index} className="mb-2">
                <strong>Passenger:</strong> {passenger} <br />
                <strong>Exit Station:</strong> {exitStation} <br />
                <strong>Fare:</strong> {fare.toString()}
              </li>
            );
          })
        ) : (
          <p>No JourneyCompleted events found.</p>
        )}
      </ul>
    </div>
  );
}
