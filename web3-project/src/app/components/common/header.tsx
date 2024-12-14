"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { client } from "../../client";
import React from "react";
import WithdrawCarbonTokenModal from "../contract/WithdrawCarbonToken";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      console.log("Scroll Position:", scrollTop); // Debugging
      const isTop = scrollTop < 100;
      setIsScrolled(!isTop);
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`sticky w-full top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white text-black" : "bg-black text-white"}`}>
      <header className="container mx-auto flex justify-between items-center p-6 ">
        {/* Logo */}
        <div className="text-2xl font-bold px-4 py-2">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">MILEZ</span>
        </div>

        {/* Menu Navigasi */}
        <div className="hidden md:flex items-center px-6 py-4">
          <Link href="/dashboard" className={`hover:underline ${pathname === "/dashboard" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            Home
          </Link>
          <Link href="/dashboard/Journey" className={`hover:underline ${pathname === "/dashboard/Journey" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            Journey
          </Link>
          <Link href="/dashboard/Redeem" className={`hover:underline ${pathname === "/dashboard/Redeem" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            Redeem
          </Link>
          {/* <Link href="/dashboard/MarketPlace" className={`hover:underline ${pathname === "/dashboard/MarketPlace" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            MarketPlace
          </Link> */}
          <Link href="/dashboard/Store" className={`hover:underline ${pathname === "/dashboard/Store" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            Store
          </Link>
          <Link href="/dashboard/History" className={`hover:underline ${pathname === "/dashboard/History" ? "text-teal-400 font-semibold px-4" : "hover:text-teal-400 px-4"}`}>
            History
          </Link>
        </div>

        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
          View Balance / Withdraw
        </button>

        {/* Tombol Connect Wallet */}
        <div className="hidden md:flex items-center space-x-4 px-6 py-2 rounded-xl">
          <ThirdwebConnectButton client={client} theme="dark" />
        </div>

        {/* Tombol Mobile Menu */}
        <div className="md:hidden bg-blues px-4 py-2 rounded-xl flex items-center">
          <span className="mr-2">MENU</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        {/* Modal */}
        {showModal && <WithdrawCarbonTokenModal onClose={() => setShowModal(false)} />}
      </header>
    </div>
  );
}
