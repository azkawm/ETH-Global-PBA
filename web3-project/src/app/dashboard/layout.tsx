"use client";

import Header from "../components/common/header";
import Footer from "../components/common/footer";
import "../globals.css";

import { ThirdwebProvider } from "thirdweb/react";

// Layout Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full">
      <ThirdwebProvider>
        <Header />
        <div className="flex-grow w-full max-w-full">{children}</div>
        <Footer />
      </ThirdwebProvider>
    </div>
  );
}
