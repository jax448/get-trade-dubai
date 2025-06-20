import { Button } from "@/components/ui/button";
import React, { useState } from "react";

import Image from "next/image";
import emptyWallet from "@public/pics/Generate-wallet-Icon.svg";
import ClipboardCopy from "@/components/ClipBoardCopy";
import { useGetBalanceWithoutPooling } from "@/api-lib/api-hooks/useAccountsApiHook";
import { CustomLoader } from "@/components/loader";
import { useSolanaAuthStore } from "@/store/auth";
import Link from "next/link";

function Component3({
  MaxTradingWallet,
  steps,
  MaxworthPrivateKey,
}: {
  MaxTradingWallet: string;
  MaxworthPrivateKey: string;
  steps: number;
}) {
  const [isloading, setisloading] = useState(false);

  const key = useSolanaAuthStore().key;

  const { data, refetch } = useGetBalanceWithoutPooling(
    MaxTradingWallet,
    key || ""
  );

  const handleCheckBalance = async () => {
    setisloading(true);
    await refetch();
    setisloading(false);
  };

  return (
    <div
      className={`" h-full relative z-10 flex flex-col items-center justify-between w-full mx-auto mt-8 max-w-[474px] xl:p-[4rem] py-[2rem] px-[1rem] rounded-[16px] bg-[#FFFFFF1A] [box-shadow:inset_0_-1px_4px_0px_#7F7F7F40]   " ${
        steps > 3 || MaxworthPrivateKey || !MaxTradingWallet
          ? "opacity-40 cursor-not-allowed  "
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
          Confirm Your{" "}
        </h1>
        <h2 className=" pt-[2rem] font-semibold text-[clamp(1.6rem,2.59vw+0.771rem,3.879rem)] leading-[clamp(2.2rem,2.5vw+1.4rem,4.4rem)]  tracking-[-2%] text-center ">
          Trading wallet Balance
        </h2>
        <div className=" space-y-[3.2rem] pt-[3rem] ">
          <div className="space-y-[1.2rem]">
            <p className="font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)]tracking-[0%] text-center text-[white]">
              Oops! Your Maxworth Wallet has {data?.data.balance || "0"} SOL
              Deposit SOL to this wallet to stat trading
            </p>
            <ClipboardCopy
              content={
                steps > 3 || MaxworthPrivateKey || !MaxTradingWallet
                  ? ""
                  : MaxTradingWallet
              }
            />
          </div>
        </div>
        <div className="w-full  flex items-center h-full justify-center mt-8   ">
          <Button
            className=" my-auto   w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] font-bold leading-[38.74px] text-center text-[#000000] disabled:opacity-60 disabled:cursor-not-allowed  "
            onClick={() => handleCheckBalance()}
            disabled={isloading}
          >
            Check Balance
            {isloading && <CustomLoader size="md" variant="light" />}
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center mt-8   ">
        <Link
          href={"/"}
          className=" inline-flex items-center justify-center  w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] font-bold leading-[38.74px] text-center text-[#000000] disabled:opacity-60 disabled:cursor-not-allowed  "
        >
          Continue
        </Link>
      </div>
    </div>
  );
}

export default Component3;
