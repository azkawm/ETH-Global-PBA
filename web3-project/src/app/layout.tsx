"use client";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThirdwebProvider } from "thirdweb/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col max-h-screen  h-screen bg-blues  ">
        <div className="flex-grow">
          {" "}
          <ThirdwebProvider>{children} </ThirdwebProvider>
        </div>
      </body>
    </html>
  );
}
