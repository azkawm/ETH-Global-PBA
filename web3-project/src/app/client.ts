import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Replace with your client ID from the Thirdweb dashboard
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

// Create Thirdweb client
export const client = createThirdwebClient({
  clientId: clientId,
});

// Replace with your chain ID (e.g., 11155420 for Sepolia)
const chain = defineChain(11155420);

// First contract
export const marketplaceContract = getContract({
  client,
  chain: chain,
  address: "0x807421F9aD265896B2894f680A4d4bAD5259b895", // Address of the Marketplace contract
});

// Second contract
export const transportTrackerContract = getContract({
  client,
  chain: chain,
  address: "0x38aC81461F2b67334116EBf873B4aE59C2A3d463", // Address of the Transport Tracker contract
});

export const tokenContract = getContract({
  client,
  chain: chain,
  address: "0xdfD6d4Bd4C28244F6BaBA7C9c310E204611B399f", // Address of the Transport Tracker contract
});
