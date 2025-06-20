"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  //   DialogTitle,
} from "../../ui/dialog";
import Image from "next/image";
import AlertImage from "@public/pics/AlertModalImg.png";
import { useWatchListAndAlertStore } from "@/store/WachListAndAlertModals";
import { useSolanaAuthStore } from "@/store/auth";
import AlertList from "./AlertList";
import { useGetAlerts } from "@/api-lib/api-hooks/useWatchListApiHook";
import { Skeleton } from "@/components/ui/skeleton";

function AlertModal() {
  const key = useSolanaAuthStore((state) => state.key);
  const isAlertModalOpen = useWatchListAndAlertStore(
    (state) => state.isAlertModalOpen
  );
  const toggleAlertModal = useWatchListAndAlertStore(
    (state) => state.toggleAlertModal
  );

  const { data: AlertsData, isLoading } = useGetAlerts(key || "");

  return (
    <Dialog
      open={isAlertModalOpen}
      onOpenChange={() => {
        toggleAlertModal();
      }}
    >
      <DialogContent
        aria-describedby="connect you wallet modal"
        className="max-w-[860px] w-full !rounded-[18px] bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)] border-none text-white md:pt-[4rem] pt-[1rem] md:pb-[4rem] pb-[2rem] px-[unset]  "
      >
        <DialogHeader className="relative">
          {key && (
            <h1 className=" border-b border-b-[#FFFFFF1A] md:pb-[2rem] pb-[1rem]  text-[#FEFEFF] font-bold text-[28px] leading-[40px] tracking-[-2%] text-center  ">
              My Alerts{" "}
            </h1>
          )}
        </DialogHeader>
        <DialogDescription className="px-[1rem]  ">
          {key ? (
            <div className="px-[1rem] space-y-4 md:mt-[2rem] xl:max-h-[40rem] max-h-[30rem] overflow-y-auto scrollbar-hide">
              {isLoading ? (
                Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-12 w-full bg-[#F1F2FF0D]" />
                    <Skeleton className="h-24 w-full bg-[#F1F2FF03]" />
                  </div>
                ))
              ) : AlertsData && AlertsData.data.length > 0 ? (
                AlertsData.data.map((alert, index) => (
                  <AlertList key={alert.id || index} alert={alert} />
                ))
              ) : (
                <div className="flex flex-col mt-[2rem] items-center justify-center">
                  <Image src={AlertImage} alt="No alerts" />
                  <div>
                    <h2 className="font-bold text-[clamp(24px,5vw,32px)] leading-[clamp(36px,6vw,57.57px)] tracking-[-2%] text-center text-[#FEFEFF]">
                      You haven&apos;t set any alert yet
                    </h2>
                    <p className="text-white font-normal text-[clamp(14px,3.5vw,16px)] leading-[clamp(22px,5vw,28.57px)] tracking-[-2%] text-center">
                      Set up alerts to stay updated on price movements for your
                      favorite tokens
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show message if not logged in
            <div className="flex flex-col mt-[2rem] items-center justify-center">
              <Image src={AlertImage} alt="Not logged in" />
              <div>
                <h2 className="font-bold text-[clamp(24px,5vw,32px)] leading-[clamp(36px,6vw,57.57px)] tracking-[-2%] text-center text-[#FEFEFF]">
                  You haven&apos;t set any alert yet
                </h2>
                <p className="text-white font-normal text-[clamp(14px,3.5vw,16px)] leading-[clamp(22px,5vw,28.57px)] tracking-[-2%] text-center">
                  Connect your wallet to create and manage price alerts
                </p>
              </div>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default AlertModal;
