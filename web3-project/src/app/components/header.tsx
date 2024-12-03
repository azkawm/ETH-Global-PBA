"use client";
import Link from "next/link";

import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";

import { client } from "../client";

export default function Header() {
  return (
    <header className="p-6 sticky top-0 z-50 transition-colors duration-300 bg-black opacity-90">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold px-4 py-2">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">MILEZ</span>
        </div>

        {/* Menu Navigasi */}
        <div className="hidden md:flex items-center px-6 py-4">
          <Link href="#intro" className="text-teal-400 font-semibold px-4">
            Dashboard
          </Link>
          <Link href="#create" className="text-white hover:text-teal-400 px-4">
            Redeem
          </Link>
          <Link href="#chill" className="text-white hover:text-teal-400 px-4">
            NFT
          </Link>
          <Link href="#hangout" className="text-white hover:text-teal-400 px-4">
            LeaderBoard
          </Link>
        </div>

        {/* Tombol Connect Wallet */}
        <div className="hidden md:flex items-center space-x-4 text-white px-6 py-2 rounded-xl">
          <ThirdwebConnectButton
            // Supported chains

            client={client} // Thirdweb client instance
            theme="dark" // Theme fallback to 'dark'
          />
        </div>

        {/* Tombol Mobile Menu */}
        <div className="md:hidden bg-blues text-white px-4 py-2 rounded-xl flex items-center">
          <span className="mr-2">MENU</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </nav>
    </header>
  );
}
