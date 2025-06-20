import { useSolanaAuthStore } from "@/store/auth";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

function DepositQrCode({ amount }: { amount: number }) {
  const getTradePublicKey = useSolanaAuthStore().getTradePublicKey;

  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const url = new URL("solana:" + getTradePublicKey);

    url.searchParams.append(
      "amount",
      `${amount && amount !== 0 ? amount : 0.01}`
    );

    url.searchParams.append("label", "Deposit to Your Trading Wallet");

    setQrUrl(url.toString());
  }, [getTradePublicKey, amount]);

  return (
    <>
      {!qrUrl || !getTradePublicKey ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-center text-[#000000] font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)] tracking-[0%]">
            QR code not available. Please generate your wallet first.
          </p>
        </div>
      ) : (
        <QRCode value={qrUrl} className=" w-full h-full  " level="H" />
      )}
    </>
  );
}

export default DepositQrCode;
