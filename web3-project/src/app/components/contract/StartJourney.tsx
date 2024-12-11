"use client";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../../client";

export default function StartJourney() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [entryStation, setEntryStation] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Status loading
  const [hasStarted, setHasStarted] = useState(false); // Status perjalanan

  const handleStartJourney = () => {
    // Validasi input
    if (!entryStation.trim()) {
      alert("Please select a station.");
      return;
    }

    // Siapkan transaksi
    const transaction = prepareContractCall({
      contract,
      method: "function startJourney(string memory entryStation)",
      params: [entryStation],
    });

    // Kirim transaksi
    setIsLoading(true);
    sendTransaction(transaction, {
      onSuccess: () => {
        console.log("Journey started successfully");
        setHasStarted(true); // Tandai perjalanan sudah dimulai
        setEntryStation(""); // Reset input
        setIsLoading(false); // Matikan status loading
        alert("Journey started successfully!");
      },
      onError: (error) => {
        console.error("Failed to start journey:", error);
        setIsLoading(false); // Matikan status loading
        alert(`Failed to start journey: ${error.message}`);
      },
    });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="entryStation" className="block mb-2 text-lg font-medium">
          Select Entry Station:
        </label>
        <select
          id="entryStation"
          value={entryStation}
          onChange={(e) => setEntryStation(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={isLoading || hasStarted} // Disable jika loading atau sudah dimulai
        >
          <option value="">-- Select Station --</option>
          <option value="Station A">Station A</option>
        </select>
        <button
          type="button"
          onClick={handleStartJourney}
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isLoading || hasStarted ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading || hasStarted} // Disable tombol jika loading atau perjalanan dimulai
        >
          {isLoading ? "Starting Journey..." : hasStarted ? "Journey Started" : "Start Journey"}
        </button>
      </form>
    </div>
  );
}
