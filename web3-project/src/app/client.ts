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
const chain = defineChain(4202);

// First contract
export const marketplaceContract = getContract({
  client,
  chain: chain,
  address: "0x8bBD8EC12514fA793b410B22e872e42F75dE2848", // Address of the Marketplace contract
});

// Second contract
export const transportTrackerContract = getContract({
  client,
  chain: chain,
  address: "0xd64302f0D3C880d75913f3a9C3324e663Bc4d09d", // Address of the Transport Tracker contract
});

export const tokenContract = getContract({
  client,
  chain: chain,
  address: "0xc8baf8eEAB6F63aC4B2F8605E70e9367d9803D5e", // Address of the Transport Tracker contract
});
