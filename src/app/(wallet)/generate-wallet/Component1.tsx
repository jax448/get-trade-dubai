import { Button } from "@/components/ui/button";
import React from "react";

import Image from "next/image";
import emptyWallet from "@public/pics/Generate-wallet-Icon.svg";
import Link from "next/link";
import { useSolanaAuthStore } from "@/store/auth";

function Component1({
  solpublicKey,
  isLoading,
  handleGenerate,
}: {
  solpublicKey: string;
  isLoading: boolean;
  handleGenerate: () => void;
}) {
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );
  return (
    <div
      className={` h-full relative z-10 flex flex-col items-center justify-between w-full mx-auto mt-8 max-w-[474px] xl:p-[4rem] py-[2rem] px-[1rem] rounded-[16px] bg-[#FFFFFF1A] [box-shadow:inset_0_-1px_4px_0px_#7F7F7F40]  ${
        Boolean(getTradePublicKey) ? " opacity-40 cursor-not-allowed " : ""
      }   `}
    >
      <div className=" flex flex-col items-center justify-between  ">
        <div className="mb-12">
          <div className="md:w-[67px] md:h-[67px] w-[44px] h-[44px] relative flex items-center justify-center">
            <Image src={emptyWallet} alt="" fill />
          </div>
        </div>
        <div className=" w-full ">
          {/* Title */}
          <h1 className="font-normal text-[clamp(1.2rem,1.492vw+0.723rem,2.513rem)] leading-[clamp(1.6rem,1.023vw+1.273rem,2.5rem)] tracking-[0%] text-center mb-2 text-white ">
            Generate and download your
          </h1>
          <h2 className="font-semibold text-[clamp(1.6rem,2.59vw+0.771rem,3.879rem)] leading-[clamp(2.2rem,8.864vw+_-0.636rem,10rem)] tracking-[-2%] text-center ">
            Trading wallet
          </h2>
          {/* Wallet Card */}
          <div className=" mt-[3rem] ">
            <div className=" space-y-8 ">
              <div className="space-y-2">
                <p className="font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)] tracking-[0%] text-center text-white ">
                  You are logged in with
                </p>
                <Link
                  href={`https://solscan.io/account/${solpublicKey}`}
                  target="_blank"
                  className="block text-[#4CF37B] text-opacity-80 font-bold text-[clamp(1.4rem,0.873vw+1.121rem,2.168rem)] leading-[clamp(1.7rem,0.532vw+1.53rem,2.168rem)] tracking-[0%] text-center text-wrap whitespace-pre "
                >
                  {!solpublicKey
                    ? "Please connect your Phantom Wallet."
                    : solpublicKey?.slice(0, 10) +
                      " .... " +
                      solpublicKey?.slice(34)}
                </Link>
              </div>
              <div className="  flex justify-center mx-auto ">
                <p className="text-white font-normal text-[clamp(1rem,0.455vw+0.855rem,1.44rem)] leading-[clamp(1.2rem,0.227vw+1.127rem,1.4rem)] tracking-[0%] text-center  ">
                  Click Generate to obtain your Maxworth trading wallet and
                  private key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-auto   ">
        <Button
          onClick={handleGenerate}
          disabled={isLoading || Boolean(getTradePublicKey)}
          className="font-bold leading-[38.74px]  w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] text-center text-[#000000] disabled:opacity-80 disabled:cursor-not-allowed   "
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}

export default Component1;
