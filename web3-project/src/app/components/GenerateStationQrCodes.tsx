"use client";
import React from "react";
import QRCode from "react-qr-code";

export default function GenerateStationQRCodes() {
  // Daftar stasiun
  const stations = [
    { id: "1", name: "Station A" },
    { id: "2", name: "Station B" },
    { id: "3", name: "Station C" },
  ];

  return (
    <div className="p-4 bg-gray-800 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Generate QR Codes for Stations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station.id} className="bg-white p-4 rounded shadow-md flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">{station.name}</h2>
            <QRCode
              value={station.name} // Data QR Code (nama stasiun)
              size={150} // Ukuran QR Code
              bgColor="#ffffff" // Warna latar belakang
              fgColor="#000000" // Warna QR Code
              level="M" // Koreksi kesalahan
            />
          </div>
        ))}
      </div>
    </div>
  );
}
