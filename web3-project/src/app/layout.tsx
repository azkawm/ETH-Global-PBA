"use client";

import Header from "./components/header";
import Footer from "./components/footer";
import "./globals.css";

import { ThirdwebProvider } from "thirdweb/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-custom-gradient  ">
        <ThirdwebProvider>
          <Header />

          <div className="flex-grow"> {children}</div>

          <Footer />
        </ThirdwebProvider>
      </body>
    </html>
  );
}
