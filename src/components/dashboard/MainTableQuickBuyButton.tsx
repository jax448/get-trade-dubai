"use client";
import React, { memo, useMemo, useCallback, useState } from "react";
import QuickBuyIcon from "@public/pics/QuickBuyTableIcon.png";
import CrossQuickBuyIcon from "@public/pics/CrossQuickBuyIcon.png";
import { Button } from "../ui/button";
import { useQuickBuyStore } from "@/store/QuickBuy";
import Image from "next/image";
import { useSolanaAuthStore } from "@/store/auth";
import { AccountsService } from "@/api-lib/services/AccountsService";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";
import { CustomLoader } from "../loader";
import { executeTrade } from "@/actions/trade";
import { useSwapDataAfterTrade } from "@/api-lib/api-hooks/useAccountsApiHook";
import { queryClient } from "@/Context/React-Query-Provider";
import { CheckCircleIcon, CircleAlert } from "lucide-react";

const MainTableQuickBuyButton = ({
  tokenAddress,
}: {
  tokenAddress: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = useQuickBuyStore((state) => state.quickBuyAmount);
  const isQuickBuyEnabled = useQuickBuyStore(
    (state) => state.isQuickBuyEnabled
  );

  const key = useSolanaAuthStore((state) => state.key);
  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  // Preload both images to prevent blinking
  const handleImageOnLoad = useCallback(() => {
    // This creates image objects to preload images
    const quickBuyImg = new window.Image();
    quickBuyImg.src = QuickBuyIcon.src;

    const crossQuickBuyImg = new window.Image();
    crossQuickBuyImg.src = CrossQuickBuyIcon.src;
  }, []);

  const { mutate } = useSwapDataAfterTrade(key || "");

  // Handle button click
  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        setIsSubmitting(true);
        if (!key) {
          OpenModalFunc();
          return;
        }
        if (!isQuickBuyEnabled) {
          toast.custom((t) => (
            <CustomToast
              title="Quick Buy is not enabled"
              onClose={() => toast.dismiss(t.id)}
              type="error"
              t={t}
            />
          ));
          return;
        }
        if (amount === 0 || !amount) {
          toast.custom((t) => (
            <CustomToast
              title="Please enter a valid amount"
              onClose={() => toast.dismiss(t.id)}
              type="error"
              t={t}
            />
          ));
          return;
        }
        const amounta = Number(amount ? amount : 0);

        const response = await AccountsService.getTradeDetails(
          tokenAddress,
          amounta,
          "buy",
          getTradePublicKey || "",
          key
        );

        if (!response.data || response.data.swapMode === null) {
          console.log("should be error in the get trade details: ", response);
          throw new Error("No Route Found. Try different amount.");
        }

        const tradeData = {
          selectedSol: amounta,
          swapdata: response.data,
        };

        const loadingToast = toast.custom(
          (t) => (
            <CustomToast
              type="info"
              title="Executing Transaction"
              t={t}
              description="Please wait while your trade is being processed on the blockchain..."
              icon={<CustomLoader size={"sm"} variant={"info"} />}
              onClose={() => toast.dismiss(t.id)}
            />
          ),
          {
            duration: 6000,
          }
        );

        const result = await executeTrade(key || "", tradeData);

        if (!result.success || !result.signature) {
          throw new Error(result.error || "Trade execution failed");
        }

        const responseSwapData = {
          transactionId: result.signature,
          method: "buy",
          wallet: getTradePublicKey || "",
          amount: Number(tradeData.selectedSol),
        };

        mutate(responseSwapData, {
          onSuccess() {
            toast.dismiss(loadingToast);
            toast.custom((t) => (
              <CustomToast
                type="success"
                title="Trade Executed Successfully"
                t={t}
                description={`${amount} has been confirmed`}
                icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
                onClose={() => toast.dismiss(t.id)}
              />
            ));
            queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
            queryClient.invalidateQueries({ queryKey: ["firstbalance"] });
          },

          onError(error) {
            toast.dismiss(loadingToast);
            toast.custom((t) => (
              <CustomToast
                type="error"
                title="Transaction Failed"
                t={t}
                description={
                  error.message || "Please try again or check wallet connection"
                }
                icon={<CircleAlert className="h-6 w-6 text-red-500" />}
                onClose={() => toast.dismiss(t.id)}
              />
            ));
          },
        });
      } catch (error) {
        console.error("Trade failed:", error);
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Transaction Failed"
            t={t}
            description={
              error instanceof Error ? error.message : "Trade execution failed"
            }
            icon={<CircleAlert className="h-6 w-6 text-red-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      OpenModalFunc,
      amount,
      getTradePublicKey,
      key,
      tokenAddress,
      mutate,
      isQuickBuyEnabled,
    ]
  );

  // Use React.createElement for the most optimized rendering of images
  const imageElement = useMemo(() => {
    return (
      <Image
        src={isQuickBuyEnabled ? CrossQuickBuyIcon : QuickBuyIcon}
        alt={isQuickBuyEnabled ? "Disable Quick Buy" : "Enable Quick Buy"}
        className="w-[clamp(20px,3vw,21px)] min-w-[clamp(20px,3vw,21px)] h-[clamp(20px,3vw,21px)]"
        width={21}
        height={21}
        priority
        unoptimized
        onLoad={handleImageOnLoad}
      />
    );
  }, [isQuickBuyEnabled, handleImageOnLoad]);

  // Memoize the button text
  const buttonText = useMemo(() => {
    if (!amount || amount === 0 || !isQuickBuyEnabled) return "Buy";
    return amount;
  }, [amount, isQuickBuyEnabled]);

  // Memoize the entire button content
  const buttonContent = useMemo(() => {
    return (
      <div className="flex items-center justify-center gap-2 w-full">
        {imageElement}
        <p className="whitespace-nowrap xl:block hidden overflow-hidden text-ellipsis max-w-[80px]">
          {buttonText}
        </p>
      </div>
    );
  }, [imageElement, buttonText]);

  return (
    <Button
      className="font-semibold 
                text-[clamp(10px,1.4vw,14px)] 
                leading-[clamp(14px,1.6vw,100%)] 
                tracking-[0%] bg-transparent block px-[10px] mx-auto w-full"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {buttonContent}
    </Button>
  );
};

export default memo(MainTableQuickBuyButton);
