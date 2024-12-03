"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../../client";

export default function CompleteJourney() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [exitStation, setExitStation] = useState("");

  const handleCompleteJourney = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function completeJourney(string exitStation)",
      params: [exitStation],
    });
    sendTransaction(transaction);
  };

  return (
    <div>
      <input type="text" placeholder="Enter Exit Station" value={exitStation} onChange={(e) => setExitStation(e.target.value)} className="p-2 border rounded mb-2" />
      <button onClick={handleCompleteJourney} className="bg-teal-400 px-4 py-2 rounded text-black hover:bg-teal-500">
        Complete Journey
      </button>
    </div>
  );
}
