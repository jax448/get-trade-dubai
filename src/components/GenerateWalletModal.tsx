"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CustomLoader } from "./loader";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";
import { useSolanaAuthStore } from "@/store/auth";
import walletIcon from "@public/pics/ConnectWalletIcon.png";
import Image from "next/image";

const WalletConnectModal = () => {
  const connect = useSolanaAuthStore().connect;
  const open = useSolanaAuthStore().modalOpen;
  const closeModalFunc = useSolanaAuthStore().CloseModalFunc;

  const [loading, setLoading] = useState(false);
  const [checked, setchecked] = useState(false);

  const handlConnect = async () => {
    setLoading(true);

    try {
      if (!checked) {
        toast.custom((t) => (
          <CustomToast
            title="Please accept the terms and conditions to continue"
            type="error"
            onClose={() => toast.dismiss(t.id)}
            t={t}
            key={t.id}
          />
        ));
        return;
      }

      await connect();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        closeModalFunc();
      }}
    >
      <DialogContent
        aria-describedby="connect you wallet modal"
        className="max-w-[1433px] w-full !rounded-[2.4rem] bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)]  text-white py-[12rem] px-[2rem]    "
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-[40px] md:text-[72.39px] leading-[42px] md:leading-[70.47px] tracking-[-2%] text-center text-[#FEFEFF]">
            Connect wallet
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <h3 className="font-normal text-[18px] md:text-[28px] leading-[28px] md:leading-[42px] tracking-[0%] text-center md:mb-12 mb-6 ">
          {/* Choose wallet */}
          Connect to start trading <span className="font-normal  ">
            SOL
          </span>{" "}
          now
        </h3>
        <div className="relative z-20 ">
          <div className="">
            <div className=" flex justify-center md:mb-12 mb-6   ">
              <Button
                className="md:max-w-[467px] max-w-[240px] h-[4.5rem] md:h-[7.7rem] bg-[linear-gradient(90.61deg,_#F001FF_9.09%,_#4CF37B_99.47%)] rounded-[39px] md:p-4 p-1 w-full md:text-[31px] text-[22px] font-bold leading-[32px] md:leading-[38.74px] text-center border-none disabled:opacity-80 disabled:cursor-not-allowed"
                onClick={handlConnect}
                disabled={loading}
              >
                <Image
                  src={walletIcon}
                  alt="wallet icon"
                  className="mr-2 w-[clamp(14px,4vw,24px)] h-[clamp(14px,4vw,24px)]  "
                />
                Connect Wallet
                {loading && <CustomLoader size="lg" variant="light" />}
              </Button>
            </div>
          </div>

          <div className=" flex items-center justify-center md:gap-4 gap-2  ">
            <Checkbox
              className="rounded-[0.2rem] border-white border-[1px] md:!w-[20px] md:!h-[20px] !w-[16px] !h-[16px] bg-[#1F2238] data-[state=checked]:!bg-white [&_*]:data-[state=checked]:!text-black"
              id="understand"
              checked={checked}
              required
              onCheckedChange={() => setchecked(!checked)}
            />
            <label
              htmlFor="understand"
              className="font-normal text-[14px] md:text-[24px] leading-[20px] md:leading-[28.8px] tracking-[0%] text-center text-white"
            >
              By connecting, I agree to the{" "}
              <Link href={""} className=" text-[#CDD0E5] ">
                Term
              </Link>{" "}
              &{" "}
              <Link href={""} className=" text-[#CDD0E5] ">
                Privacy
              </Link>
            </label>
          </div>

          {/* <div className="flex items-center sm:justify-between justify-center sm:gap-0 gap-3 flex-wrap  pt-4">
            <h3 className="text-[24px] font-bold leading-[29.71px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] text-white">
              New here?
            </h3>
            <Button
              aria-label="get started"
              variant="link"
              className="sm:text-[24px] text-[20px] font-medium leading-[29.71px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] text-white p-0 flex items-center gap-1"
            >
              <span className=" underline  ">Get started on Maxworth</span>
              <ChevronRight width={24} height={24} />
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
