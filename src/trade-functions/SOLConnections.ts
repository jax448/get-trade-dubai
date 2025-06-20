"server-only";
import { Connection, Commitment } from "@solana/web3.js";

// Define possible RPC endpoints
const RPC_URLS: Record<"quicknote" | "alchemy" | "devnet", string> = {
  quicknote:
    "https://twilight-omniscient-gas.solana-mainnet.quiknode.pro/8d8e6d9f9605ded69464c6b563fc741c1633e17f",
  // quicknote:
  //   "https://greatest-few-gadget.solana-mainnet.quiknode.pro/6378132d64929dc0df6f831e2b190486432c7076",
  alchemy: `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  devnet: "https://api.devnet.solana.com",
};

const selectedRPC: keyof typeof RPC_URLS = "quicknote";

// Connection commitment level
const COMMITMENT_LEVEL: Commitment = "confirmed";

// Initialize the Solana connection
export const SOLWalletConnection = new Connection(RPC_URLS[selectedRPC], {
  commitment: COMMITMENT_LEVEL,
});
