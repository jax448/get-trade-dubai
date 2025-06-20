// import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import emptyWallet from "@public/pics/Generate-wallet-Icon.svg";
import ClipboardCopy from "@/components/ClipBoardCopy";
import { useGetBalanceWithoutPooling } from "@/api-lib/api-hooks/useAccountsApiHook";
// import { CustomLoader } from "@/components/loader";
import { useSolanaAuthStore } from "@/store/auth";
import Link from "next/link";
import QRCode from "react-qr-code";

function QRCodeComponent3({
  MaxTradingWallet,
  steps,
  removeStep2Data,
}: {
  MaxTradingWallet: string;
  removeStep2Data: () => void;
  steps: number;
}) {
  //   const [isloading, setisloading] = useState(false);

  const key = useSolanaAuthStore().key;
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    const url = new URL("solana:" + MaxTradingWallet);
    url.searchParams.append("amount", "0.01"); // Optional: specify the amount to send
    url.searchParams.append("label", "Deposit to Trading Wallet"); // Optional: specify a label for the transaction

    setQrUrl(url.toString());
  }, [MaxTradingWallet]);

  const { data } = useGetBalanceWithoutPooling(MaxTradingWallet, key || "");

  //   const handleCheckBalance = async () => {
  //     setisloading(true);
  //     await refetch();
  //     setisloading(false);
  //   };

  return (
    <div
      className={`" h-full relative z-10 flex flex-col items-center justify-between w-full mx-auto mt-8 max-w-[474px] xl:px-[2rem] xl:py-[4rem] py-[2rem] px-[1rem] rounded-[16px] bg-[#FFFFFF1A] [box-shadow:inset_0_-1px_4px_0px_#7F7F7F40]   " ${
        steps < 3 || !MaxTradingWallet || !key
          ? "opacity-40 cursor-not-allowed "
          : ""
      } `}
    >
      <div className=" flex flex-col items-center justify-between ">
        <div className="pb-12">
          <div className="md:w-[67px] md:h-[67px] w-[44px] h-[44px] relative flex items-center justify-center">
            <Image src={emptyWallet} alt="" fill />
          </div>
        </div>
        <h1 className="mfont-normal text-[clamp(1.2rem,1.492vw+0.723rem,2.513rem)] leading-[clamp(1.6rem,1.023vw+1.273rem,2.5rem)] tracking-[0%] text-center mb-2 text-white ">
          Deposit Assets into the wallet, Start
        </h1>
        <h2 className=" pt-[2rem] font-semibold text-[clamp(1.6rem,2.59vw+0.771rem,3.879rem)] leading-[clamp(2.2rem,2.5vw+1.4rem,4.4rem)]  tracking-[-2%] text-center ">
          Trading Immediately
        </h2>
        <div className=" space-y-[3.2rem] pt-[3rem] w-full ">
          <div className="space-y-[1.2rem] w-full ">
            <p className="font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)]tracking-[0%] text-center text-[white]">
              Your wallet balance is{" "}
              <span className="text-[#D3FFEB]">
                {data?.data.balance || "0"} Sol
              </span>{" "}
            </p>
            <div className=" px-16 space-y-[1.2rem] ">
              <p className=" pb-[3rem]  font-medium text-[14px] leading-[100%] tracking-[0%] text-center  font-gilroy text-[#FFFFFF]">
                Scan the QR code or copy the address to add funds and start
                trading immediately
              </p>
              <div className=" flex items-center justify-center  bg-[#FFFFFF] w-[154px] h-[154px] p-[12px] mx-auto rounded-[8px]  ">
                {!qrUrl || !MaxTradingWallet ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-center text-[#000000] font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)] tracking-[0%]">
                      QR code not available. Please generate your wallet first.
                    </p>
                  </div>
                ) : (
                  <QRCode
                    value={qrUrl}
                    className=" w-full h-full  "
                    level="H"
                  />
                )}
              </div>
            </div>
            <ClipboardCopy
              content={steps > 3 || !MaxTradingWallet ? "" : MaxTradingWallet}
            />
          </div>
        </div>
        {/* <div className="w-full  flex items-center h-full justify-center mt-8   ">
          <Button
            className=" my-auto   w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] font-bold leading-[38.74px] text-center text-[#000000] disabled:opacity-60 disabled:cursor-not-allowed  "
            onClick={() => handleCheckBalance()}
            disabled={isloading}
          >
            Start Trading
            {isloading && <CustomLoader size="md" variant="light" />}
          </Button>
        </div> */}
      </div>
      <div className="w-full flex justify-center mt-8   ">
        <Link
          href={"/"}
          onClick={() => {
            removeStep2Data();
          }}
          className=" inline-flex items-center justify-center  w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] font-bold leading-[38.74px] text-center text-[#000000] disabled:opacity-60 disabled:cursor-not-allowed  "
        >
          Start Trading
        </Link>
      </div>
    </div>
  );
}

export default QRCodeComponent3;
