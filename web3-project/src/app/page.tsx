"use client";

import { ConnectButton as ThirdwebConnectButton, useConnect, useActiveAccount, useActiveWalletConnectionStatus } from "thirdweb/react";
import { IDKitWidget, useIDKit, VerificationLevel } from "@worldcoin/idkit";
import { client } from "./client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { verify } from "./actions/verify";
import type { ISuccessResult } from "@worldcoin/idkit";

export default function Home() {
  const router = useRouter();
  const connect = useConnect();
  const account = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  const { setOpen } = useIDKit(); // Control World ID Widget
  const [isVerified, setIsVerified] = useState(false); // State untuk verifikasi

  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  useEffect(() => {
    const handleConnection = async () => {
      if (connectionStatus === "connected" && account) {
        try {
          console.log("Wallet Connected:", account);
          localStorage.setItem("walletConnected", "true");
          localStorage.setItem("walletAddress", String(account));

          // Buka widget World ID setelah koneksi wallet berhasil
          setOpen(true);
        } catch (error) {
          console.error("Connection error:", error);
        }
      }
    };

    handleConnection();
  }, [account, connectionStatus, router]);

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    setIsVerified(true);
    router.push("/dashboard");
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit, sending to backend:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-6">Welcome! Please Connect Your Wallet</h1>
      <div className="hidden md:flex items-center space-x-4 text-white px-6 py-2 rounded-xl">
        <ThirdwebConnectButton
          client={client}
          theme="dark"
          onConnect={(wallet) => {
            console.log("Connecting wallet...");
          }}
        />
      </div>

      {/* World ID Widget */}
      <IDKitWidget
        action={action}
        app_id={app_id}
        onSuccess={onSuccess}
        verification_level={VerificationLevel.Device} // Atur level verifikasi
      />

      {!isVerified && (
        <button onClick={() => setOpen(true)} className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
          Verify with World ID
        </button>
      )}
    </div>
  );
}
