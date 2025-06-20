"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSolanaAuthStore } from "@/store/auth";
import { useDepositTXData } from "@/api-lib/api-hooks/useAccountsApiHook";
import { SOLWalletConnection } from "@/trade-functions/SOLConnections";

export default function PhantomTxHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Processing transaction...");

  const txSig = searchParams.get("transaction_signature");
  const { key } = useSolanaAuthStore();
  const depositTx = useDepositTXData(key || "").mutate;

  useEffect(() => {
    if (!txSig) {
      setStatus("Missing transaction signature.");
      return;
    }

    const ctx = localStorage.getItem("phantom-tx-in-flight");
    if (!ctx) {
      setStatus("No transaction context found.");
      return;
    }

    const { blockhash, lastValidBlockHeight, from, to, amount } =
      JSON.parse(ctx);

    SOLWalletConnection.confirmTransaction({
      signature: txSig,
      blockhash,
      lastValidBlockHeight,
    })
      .then(() => {
        depositTx(
          {
            senderAddress: from,
            receiverAddress: to,
            txId: txSig,
            amount,
            dateTime: new Date().toISOString(),
          },
          {
            onSuccess: () => {
              setStatus("✅ Transaction confirmed and recorded.");
              localStorage.removeItem("phantom-tx-in-flight");
              setTimeout(() => router.push("/"), 2000);
            },
            onError: () => {
              setStatus("⚠️ Transaction confirmed, but backend failed.");
            },
          }
        );
      })
      .catch((e) => {
        console.error(e);
        setStatus("❌ Failed to confirm transaction.");
      });
  }, [txSig, depositTx, router]);

  return (
    <div className="text-white p-6">
      <h2 className="text-xl font-bold">Transaction Status</h2>
      <p className="mt-4">{status}</p>
    </div>
  );
}
