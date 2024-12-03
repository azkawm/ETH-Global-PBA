"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../../client";

export default function StartJourney() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [entryStation, setEntryStation] = useState("");

  const handleStartJourney = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function startJourney(string entryStation)",
      params: [entryStation],
    });
    sendTransaction(transaction);
  };

  return (
    <div>
      <input type="text" placeholder="Enter Entry Station" value={entryStation} onChange={(e) => setEntryStation(e.target.value)} className="p-2 border rounded mb-2" />
      <button onClick={handleStartJourney} className="bg-teal-400 px-4 py-2 rounded text-black hover:bg-teal-500">
        Start Journey
      </button>
    </div>
  );
}
