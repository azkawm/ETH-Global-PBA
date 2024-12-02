import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

// Metadata for the app
export const metadata: Metadata = {
  title: "thirdweb SDK + Next Starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App Router",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ThirdwebProvider wraps the app to provide blockchain features */}
        <ThirdwebProvider>{children}</ThirdwebProvider>
        {/* ToastContainer for displaying notifications */}
        <ToastContainer />
      </body>
    </html>
  );
}
