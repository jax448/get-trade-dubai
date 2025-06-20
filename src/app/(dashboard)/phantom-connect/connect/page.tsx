"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSolanaAuthStore } from "@/store/auth";
import nacl from "tweetnacl";
import bs58 from "bs58";
import Cookies from "js-cookie";
import { AccountsService } from "@/api-lib/services/AccountsService";

export default function MobileWalletRedirectHandler() {
  const searchParams = useSearchParams();
//   const [logs, setLogs] = useState<string[]>([]);

//   const log = (msg: string) =>
//     setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${msg}`]);

  useEffect(() => {
    const handleMobileWalletRedirect = async () => {
     // log("🚀 Redirect handler started.");
     useSolanaAuthStore.setState({ modalOpen: false });
      const data = searchParams.get("data");
      const nonce = searchParams.get("nonce");
      const phantomEncryptionPublicKey = searchParams.get("phantom_encryption_public_key");

     // log("🔍 Query params received:");
     // log(JSON.stringify({ dataPresent: !!data, noncePresent: !!nonce, phantomEncryptionPublicKeyPresent: !!phantomEncryptionPublicKey }));

      if (!data || !nonce || !phantomEncryptionPublicKey) {
       // log("❌ Missing required Phantom redirect parameters.");
        return;
      }

      try {
        // IMPORTANT: Use localStorage instead of sessionStorage for cross-tab persistence
        const secretKeyBase58 = localStorage.getItem("dapp-enc-private-key");
        if (!secretKeyBase58) throw new Error("Missing dApp private key in localStorage");

       // log("🔐 Found dApp secret key, beginning decryption...");

        const dappSecretKey = bs58.decode(secretKeyBase58);
        const sharedSecret = nacl.box.before(
          bs58.decode(phantomEncryptionPublicKey),
          dappSecretKey
        );

        const decrypted = nacl.box.open.after(
          bs58.decode(data),
          bs58.decode(nonce),
          sharedSecret
        );

        if (!decrypted) throw new Error("Decryption failed");

        const decoded = new TextDecoder().decode(decrypted);
        const parsed = JSON.parse(decoded);
       // log("✅ Decryption successful.");
       // log("🔓 Decrypted payload: " + JSON.stringify(parsed));

        const publicKey = parsed.public_key;
        if (!publicKey) throw new Error("Decrypted payload missing public_key");

        useSolanaAuthStore.setState({ solpublicKey: publicKey });

      //  log("📡 Calling AccountsService.connectWallet...");
        const response = await AccountsService.connectWallet(publicKey);

        if (!response?.data) {
          throw new Error("Backend returned invalid response");
        }

       // log("✅ Backend response: " + JSON.stringify(response.data));

        useSolanaAuthStore.setState({
          getTradePublicKey: response.data.walletAddress,
          key: response.data.apiKey,
          balance: response.data.balance,
          modalOpen: false,
        });

        localStorage.removeItem("dapp-enc-private-key");

        localStorage.setItem("gettradestep2", JSON.stringify({ privateKey: null }));

        Cookies.set(
          "gettrade-auth",
          JSON.stringify({
            solpublicKey: publicKey,
            getTradePublicKey: response.data.walletAddress,
            key: response.data.apiKey,
            timestamp: Date.now(),
          }),
          {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        );

       // log("🎉 Wallet connected. Redirecting to home...");
        window.location.href = "/";
    } catch (e) {
        if (e instanceof Error) {
        //  log("❌ ERROR: " + e.message);
      
          if (e.message === "Account Not Found") {
          //  log("ℹ️ New user detected. Redirecting to /generate-wallet...");
            useSolanaAuthStore.setState({
              getTradePublicKey: null,
              key: null,
              balance: null,
              modalOpen: false,
            });
    
            const publicKeyFromDecrypted = searchParams.get("data") ? (() => {
              try {
                const dappSecretKey = bs58.decode(localStorage.getItem("dapp-enc-private-key")!);
                const sharedSecret = nacl.box.before(bs58.decode(searchParams.get("phantom_encryption_public_key")!), dappSecretKey);
                const decrypted = nacl.box.open.after(
                  bs58.decode(searchParams.get("data")!),
                  bs58.decode(searchParams.get("nonce")!),
                  sharedSecret
                );
                if (!decrypted) return null;
                const decoded = new TextDecoder().decode(decrypted);
                return JSON.parse(decoded).public_key;
              } catch {
                return null;
              }
            })() : null;
      
            if (publicKeyFromDecrypted) {
              useSolanaAuthStore.setState({ solpublicKey: publicKeyFromDecrypted });
            }
      
            window.location.href = "/generate-wallet";
            return;
          }
        } else {
        //  log("❌ Unknown error: " + JSON.stringify(e));
        }
        console.error("🚨 Phantom connect error:", e);
      }      
    };

    handleMobileWalletRedirect();
  }, [searchParams]);

  return (
    <div className="text-white p-6">
<div className="flex flex-col items-center justify-center space-y-4">
  <svg
    className="animate-spin h-10 w-10 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
  <p className="text-white text-lg font-medium">Connecting to Phantom...</p>
</div>
    </div>
  );
}
