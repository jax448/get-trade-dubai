"use client";

import { create } from "zustand";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { AccountsService } from "@/api-lib/services/AccountsService";
import { persist } from "zustand/middleware";
import CustomToast from "@/components/CustomToast";
import nacl from "tweetnacl";
import bs58 from "bs58";

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => void;
}
// Define store state interface
interface SolanaAuthState {
  solpublicKey: string | null;
  getTradePublicKey: string | null;
  key: string | null;
  balance: string | null;
  setBalance: (balance: string) => void;
  modalOpen: boolean;
  isfirstTimeLogin: boolean;
  OpenModalFunc: () => void;
  CloseModalFunc: () => void;

  // Step 2 data (moved from separate useState)
  step2data: {
    walletAddress: string | null;
    apiKey: string | null;
  };

  // Actions
  connect: () => void;
  disconnect: () => void;
  setStep2DataFunc: (walletAddress: string, apiKey: string) => void;
  accessStep2Data: () => {
    walletAddress: string | null;
    apiKey: string | null;
  };
  removeStep2Data: () => void;
  checkAuthStatus: () => void;
}

// Helper function to get the Phantom provider
// const getProvider = () => {
//   if (typeof window === "undefined") return null;

//   if ("phantom" in window) {
//     const provider = (
//       window as {
//         phantom?: {
//           solana?: {
//             isPhantom: boolean;
//             connect: () => Promise<{ publicKey: PublicKey }>;
//             disconnect: () => void;
//           };
//         };
//       }
//     ).phantom?.solana;

//     if (provider?.isPhantom) {
//       return provider;
//     }
//   }
//   throw new Error("Phantom wallet not found");
// };
let dappKeypair: nacl.BoxKeyPair | null = null;
const getProvider = (): PhantomProvider | null => {
  if (typeof window !== "undefined") {
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isMobile) {
      dappKeypair = nacl.box.keyPair();
      localStorage.setItem(
        "dapp-enc-private-key",
        bs58.encode(dappKeypair.secretKey)
      );
      const redirectLink = encodeURIComponent(
        "https://get-trade-app.vercel.app/phantom-connect/connect"
      );
      // const redirectLink = encodeURIComponent("https://cf84-182-187-140-54.ngrok-free.app/phantom-connect/connect");
      const dappEncPubKey = bs58.encode(dappKeypair.publicKey);

      const url = `https://phantom.app/ul/v1/connect?app_url=https://get-trade-app.vercel.app&redirect_link=${redirectLink}&dapp_encryption_public_key=${dappEncPubKey}`;
      // const url = `https://phantom.app/ul/v1/connect?app_url=https://https://cf84-182-187-140-54.ngrok-free.app&redirect_link=${redirectLink}&dapp_encryption_public_key=${dappEncPubKey}`;
      setTimeout(() => {
        const stored = localStorage.getItem("dapp-enc-private-key");
        if (stored) {
          window.location.href = url;
        } else {
          alert("Failed to store encryption key. Try again.");
        }
      }, 300);
      return null;
    }

    const provider = window.phantom?.solana;
    if (provider?.isPhantom) return provider;
  }

  throw new Error("Phantom wallet not found");
};
const initializeStep2Data = () => {
  if (typeof window !== "undefined") {
    const storedData = sessionStorage.getItem("gettradestep2");
    return storedData ? JSON.parse(storedData) : { privateKey: null };
  }
  return { privateKey: null };
};

// Create the Zustand store
export const useSolanaAuthStore = create<SolanaAuthState>()(
  persist(
    (set, get) => ({
      solpublicKey: null,
      getTradePublicKey: null,
      key: null,
      balance: null,
      modalOpen: false,
      isfirstTimeLogin: false,
      OpenModalFunc: () => set({ modalOpen: true }),
      CloseModalFunc: () => set({ modalOpen: false }),
      step2data: initializeStep2Data(),
      setBalance: (balance) => set({ balance }),

      connect: async () => {
        try {
          const provider = getProvider();
          if (!provider) return;
          const { publicKey } = await provider.connect();

          set({
            solpublicKey: publicKey.toBase58(),
          });

          const response = await AccountsService.connectWallet(
            publicKey.toBase58()
          );

          if (!response) {
            throw new Error(response);
          } else {
            set({
              getTradePublicKey: response.data.walletAddress,
              key: response.data.apiKey,
              balance: response.data.balance,
              isfirstTimeLogin: false,
            });

            // Cookie for server-side auth
            Cookies.set(
              "gettrade-auth",
              JSON.stringify({
                solpublicKey: publicKey.toBase58(),
                getTradePublicKey: response.data.walletAddress,
                key: response.data.apiKey,
                timestamp: Date.now(),
                isfirstTimeLogin: false,
              }),
              {
                expires: 1, // 1 day
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              }
            );

            set({
              modalOpen: false,
              isfirstTimeLogin: false,
            });

            if (window.location.pathname === "/generate-wallet") {
              window.location.href = "/";
            } else {
              window.location.reload();
            }
          }
        } catch (error) {
          if (error instanceof Error && error.message === "Account Not Found") {
            toast.custom((t) => {
              return (
                <CustomToast
                  title="Please Generate Wallet to continue!"
                  onClose={() => toast.dismiss(t.id)}
                  type="info"
                  t={t}
                />
              );
            });

            set({
              getTradePublicKey: null,
              modalOpen: false,
              isfirstTimeLogin: true,
            });

            window.location.href = "/generate-wallet";

            throw new Error("Account Not Found");
          } else {
            toast.custom((t) => {
              return (
                <CustomToast
                  title={`Error connecting to Phantom wallet: ${error}`}
                  onClose={() => toast.dismiss(t.id)}
                  type="error"
                  t={t}
                />
              );
            });
          }
          set({
            modalOpen: false,
            isfirstTimeLogin: false,
          });
          console.log("Error connecting:", error);
        }
      },

      disconnect: () => {
        try {
          const provider = getProvider();
          if (provider) {
            provider.disconnect();
          }
          set({
            solpublicKey: null,
            getTradePublicKey: null,
            key: null,
            balance: null,
            isfirstTimeLogin: false,
            step2data: { walletAddress: null, apiKey: null },
          });

          if (typeof window !== "undefined") {
            sessionStorage.removeItem("gettradestep2");
          }
          Cookies.remove("gettrade-auth");
          window.location.reload();
        } catch (error) {
          console.error("Error disconnecting:", error);
        }
      },

      setStep2DataFunc: (walletAddress, apiKey) => {
        set({
          getTradePublicKey: walletAddress,
          key: apiKey,
        });
        // Cookie for server-side auth
        Cookies.set(
          "gettrade-auth",
          JSON.stringify({
            solpublicKey: get().solpublicKey,
            getTradePublicKey: walletAddress,
            key: apiKey,
            timestamp: Date.now(),
          }),
          {
            expires: 1, // 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        );
      },

      accessStep2Data: () => {
        const data = initializeStep2Data();
        return data;
      },

      removeStep2Data: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("gettradestep2");
        }
        set({
          isfirstTimeLogin: false,
        });
      },

      checkAuthStatus: () => {
        const cookies = Cookies.get("gettrade-auth");
        const hasAuthCookie = !!cookies;

        const isCurrentlyAuthenticated = !!get().getTradePublicKey;

        if (!hasAuthCookie && isCurrentlyAuthenticated) {
          // Cookie was removed by middleware, update state
          set({
            getTradePublicKey: null,
            key: null,
            balance: null,
            solpublicKey: null,
            isfirstTimeLogin: false,
          });
        }
      },
    }),
    {
      name: "getTrade-auth",
    }
  )
);

// In your app initialization
if (typeof window !== "undefined") {
  // Check auth status every minute
  setInterval(() => {
    useSolanaAuthStore.getState()?.checkAuthStatus();
  }, 1000); //  // 1 minute interval
}
