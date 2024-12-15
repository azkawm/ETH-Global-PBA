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
  const { setOpen } = useIDKit();
  const [isVerified, setIsVerified] = useState(false);

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
          setOpen(true);
        } catch (error) {
          console.error("Connection error:", error);
        }
      }
    };

    handleConnection();
  }, [account, connectionStatus, setOpen]);

  const onSuccess = (result: ISuccessResult) => {
    window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
    setIsVerified(true);
    router.push("/dashboard");
  };

  const handleVerify = async (result: ISuccessResult): Promise<void> => {
    console.log("Proof received from IDKit, sending to backend:", JSON.stringify(result));
    const data = await verify(result);
    if (!data.success) {
      throw new Error(`Verification failed: ${data.detail}`);
    }
    console.log("Successful response from backend:", JSON.stringify(data));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-6">Welcome! Please Connect Your Wallet</h1>

      <div className="hidden md:flex items-center space-x-4 text-white px-6 py-2 rounded-xl">
        <ThirdwebConnectButton
          client={client}
          theme="dark"
          onConnect={(wallet) => {
            console.log("Connecting wallet...");
          }}
        />
      </div>

      <div className="mt-6">
        <IDKitWidget app_id={app_id} action={action} onSuccess={onSuccess} handleVerify={handleVerify} verification_level={VerificationLevel.Device}>
          {({ open }) => (
            <div>
              <button onClick={open} className="mt-6 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600" disabled={isVerified}>
                {isVerified ? "Verified ✓" : "Verify with World ID"}
              </button>
            </div>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}
