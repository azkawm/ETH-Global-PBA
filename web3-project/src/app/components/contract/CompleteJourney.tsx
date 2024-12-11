"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { transportTrackerContract } from "../../client";

export default function CompleteJourney() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [exitStation, setExitStation] = useState("");
  const [isCompleted, setIsCompleted] = useState(false); // Status perjalanan
  const [isLoading, setIsLoading] = useState(false); // Status loading

  const handleCompleteJourney = async () => {
    // Validasi input
    if (!exitStation.trim()) {
      alert("Please select an exit station.");
      return;
    }

    // Siapkan transaksi
    const transaction = prepareContractCall({
      contract: transportTrackerContract,
      method: "function completeJourney(string exitStation)",
      params: [exitStation],
    });

    // Kirim transaksi
    setIsLoading(true);
    sendTransaction(transaction, {
      onSuccess: () => {
        setIsCompleted(true); // Tandai perjalanan selesai
        setExitStation(""); // Reset input exitStation
        setIsLoading(false);
        alert("Journey completed successfully!");
      },
      onError: (err) => {
        console.error("Error completing journey:", err);
        setIsLoading(false);
        alert(`Failed to complete journey: ${err.message}`);
      },
    });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="exitStation" className="block mb-2 text-lg font-medium">
          Select Exit Station:
        </label>
        <select
          id="exitStation"
          value={exitStation}
          onChange={(e) => setExitStation(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={isLoading || isCompleted} // Disable jika loading atau perjalanan selesai
        >
          <option value="">-- Select Station --</option>
          <option value="Station B">Station B</option>
          <option value="Station C">Station C</option>
        </select>
        <button
          type="button"
          onClick={handleCompleteJourney}
          className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 ${isLoading || isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading || isCompleted} // Disable tombol jika loading atau perjalanan selesai
        >
          {isLoading
            ? "Completing Journey..." // Tampilkan status loading
            : isCompleted
            ? "Journey Completed"
            : "Complete Journey"}
        </button>
      </form>
    </div>
  );
}
