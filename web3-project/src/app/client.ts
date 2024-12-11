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
  address: "0xf90a05b72D706fa7B23a07d7cB2C37d186b41574", // Address of the Marketplace contract
});

// Second contract
export const transportTrackerContract = getContract({
  client,
  chain: chain,
  address: "0x38aC81461F2b67334116EBf873B4aE59C2A3d463", // Address of the Transport Tracker contract
});
