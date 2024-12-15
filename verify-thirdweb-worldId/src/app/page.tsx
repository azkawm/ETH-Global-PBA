"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";
import { useState, useEffect } from "react";
import { ConnectButton } from "thirdweb/react";
import { toast } from "react-toastify";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "@/app/client";
import {
  useReadContract,
  useSendTransaction,
  TransactionButton,
  useContractEvents,
} from "thirdweb/react";

export default function Home() {
  const [number, setNumber] = useState(0);
  const [tempNumber, setTempNumber] = useState("");
  const contract = getContract({
    client,
    chain: defineChain(4202),
    address: "0xa36d09e39Ef9b1D0685e3caECcD20f6379a1a9E5",
  });

  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
        result.nullifier_hash
    );
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log(
      "Proof received from IDKit, sending to backend:\n",
      JSON.stringify(result)
    ); // Log the proof from IDKit to the console for visibility
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div>
      <div className="mx-auto py-5 text-center">
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Counter DApp",
            url: "https://pelitabangsa.co.id",
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center align-middle h-screen">
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          handleVerify={handleProof}
          verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
        />
        <button
          className="border border-white bg-white text-black rounded-md"
          onClick={() => setOpen(true)}
        >
          <div className="mx-3 my-1">Verify with World ID</div>
        </button>
      </div>
    </div>
  );
}
