"use client";

import JourneyHistory from "../../components/contract/EventContract.tsx/JourneyHistoryEvent";

export default function HistoryPage() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center">
      <div className="max-w-5xl w-full p-6">
        {/* Menampilkan Riwayat Perjalanan */}
        <JourneyHistory />
      </div>
    </div>
  );
}
