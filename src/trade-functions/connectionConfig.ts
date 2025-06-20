import { Commitment } from "@solana/web3.js";

// Define possible RPC endpoints
export const RPC_URLS: Record<"quicknote" | "alchemy" | "devnet", string> = {
  quicknote:
    "https://twilight-omniscient-gas.solana-mainnet.quiknode.pro/8d8e6d9f9605ded69464c6b563fc741c1633e17f",
  // quicknote:
  //   "https://greatest-few-gadget.solana-mainnet.quiknode.pro/6378132d64929dc0df6f831e2b190486432c7076",
  alchemy: `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  devnet: "https://api.devnet.solana.com",
};

export const selectedRPC: keyof typeof RPC_URLS = "quicknote";

// Connection commitment level
const COMMITMENT_LEVEL: Commitment = "confirmed";

// solana connection config
export const CONNECTION_CONFIG = {
  commitment: COMMITMENT_LEVEL,
  confirmTransactionInitialTimeout: 60000, // 60 seconds
};
