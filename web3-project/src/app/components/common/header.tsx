"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { client } from "../../client";
import WithdrawCarbonTokenModal from "../contract/WithdrawCarbonToken";
import { Wallet } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/70 backdrop-blur-lg text-white" : "bg-gray-900 text-white"}`}>
      {/* Header Container */}
      <header className="relative w-full flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">MILEZ</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {[
            { name: "Home", path: "/dashboard" },
            { name: "Journey", path: "/dashboard/Journey" },
            { name: "Redeem", path: "/dashboard/Redeem" },
            { name: "Store", path: "/dashboard/Store" },
            { name: "History", path: "/dashboard/History" },
          ].map((link) => (
            <Link key={link.path} href={link.path} className={`relative pb-2 font-medium transition-all duration-300 ${pathname === link.path ? "text-teal-400" : "hover:text-teal-400"}`}>
              {link.name}
              {/* Garis bawah aktif */}
              {pathname === link.path && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-teal-400"></span>}
            </Link>
          ))}
        </div>

        {/* Balance & Wallet Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-all duration-300">
            <Wallet size={20} />
            <span className="text-sm font-semibold">Balance</span>
          </button>
          <ThirdwebConnectButton client={client} theme="dark" />
        </div>

        {/* Mobile Menu Button (Tampil hanya di ukuran lg ke bawah) */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Garis Bawah Global di Navbar */}
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-600/20"></span>
      </header>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-gray-900 text-white flex flex-col items-center space-y-4 py-4">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-teal-400">
            Home
          </Link>
          <Link href="/dashboard/Journey" onClick={() => setIsOpen(false)} className="hover:text-teal-400">
            Journey
          </Link>
          <Link href="/dashboard/Redeem" onClick={() => setIsOpen(false)} className="hover:text-teal-400">
            Redeem
          </Link>
          <Link href="/dashboard/Store" onClick={() => setIsOpen(false)} className="hover:text-teal-400">
            Store
          </Link>
          <Link href="/dashboard/History" onClick={() => setIsOpen(false)} className="hover:text-teal-400">
            History
          </Link>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-all duration-300">
            <Wallet size={20} />
            <span className="text-sm font-semibold">Balance</span>
          </button>
          <ThirdwebConnectButton client={client} theme="dark" />
        </div>
      )}

      {/* Modal */}
      {showModal && <WithdrawCarbonTokenModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
