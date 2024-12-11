"use client";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import StartJourney from "../../components/contract/StartJourney";
import CompleteJourney from "../../components/contract/CompleteJourney";
import JourneyProgress from "../../components/contract/ReadContractInfo/Journeys";
import RewardPerUnit from "../../components/contract/ReadContractInfo/RewardPerUnit";
import CalculateReward from "../../components/contract/ReadContractInfo/CalculateReward";

export default function JourneyPage() {
  const activeAccount = useActiveAccount();
  const userAddress = activeAccount?.address || ""; // Mendapatkan alamat pengguna
  const [distance, setDistance] = useState<number | null>(null); // State untuk menyimpan jarak perjalanan

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Journey</h1>

      {/* Bagian Mulai dan Menyelesaikan Perjalanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Journey Section */}
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Start a Journey</h2>
          <StartJourney />
        </div>

        {/* Complete Journey Section */}
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Complete Your Journey</h2>
          <CompleteJourney />
        </div>
      </div>

      {/* Progres Perjalanan */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Journey Progress</h2>
        {userAddress ? <JourneyProgress userAddress={userAddress} /> : <p className="text-gray-700">Please connect your wallet to see journey progress.</p>}
      </div>

      {/* Kalkulator Reward */}
      <div className="p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Calculate Your Reward</h2>
        <RewardPerUnit /> {/* Gunakan komponen RewardPerUnit */}
        <div className="my-4">
          <label htmlFor="distance" className="block text-lg mb-2">
            Enter Distance (in km):
          </label>
          <input id="distance" type="number" value={distance ?? ""} onChange={(e) => setDistance(Number(e.target.value))} className="p-2 border rounded w-full" placeholder="Enter distance" />
        </div>
        {distance !== null && <CalculateReward distance={distance} />} {/* Gunakan komponen CalculateReward */}
      </div>
    </div>
  );
}
