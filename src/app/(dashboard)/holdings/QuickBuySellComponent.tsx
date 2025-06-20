import React, { useState } from "react";

import greenbuy from "@public/pics/greenBuyIcon.png";
import yellowsell from "@public/pics/yellowSellIcon.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSwapDataAfterTrade } from "@/api-lib/api-hooks/useAccountsApiHook";
import { useSolanaAuthStore } from "@/store/auth";
import { useQuickBuyStore } from "@/store/QuickBuy";
import { AccountsService } from "@/api-lib/services/AccountsService";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import { CustomLoader } from "@/components/loader";
import { executeTrade } from "@/actions/trade";
import { CheckCircleIcon, CircleAlert } from "lucide-react";
import { queryClient } from "@/Context/React-Query-Provider";

type transactionType = "buy" | "sell";

function QuickBuySellComponent({
  tokenAddress,
  tokenBalance,
}: {
  tokenAddress: string;
  tokenBalance: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = useSolanaAuthStore((state) => state.key);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );
  const amount = useQuickBuyStore((state) => state.quickBuyAmount);
  const isQuickBuyEnabled = useQuickBuyStore(
    (state) => state.isQuickBuyEnabled
  );
  const { mutate, isPending } = useSwapDataAfterTrade(key || "");

  const onSubmit = async (
    TransactionType: transactionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      setIsSubmitting(true);
      if (!key) {
        return;
      }
      if (!isQuickBuyEnabled && TransactionType === "buy") {
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Please Enable Quick-Buy"
            t={t}
            description="Please enable quick buy to buy"
            icon={<CircleAlert className="h-6 w-6 text-red-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        return;
      }

      if ((!amount || amount === 0) && TransactionType === "buy") {
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Please enter an amount"
            t={t}
            description="Please enter an amount to buy"
            icon={<CircleAlert className="h-6 w-6 text-red-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        return;
      }

      const customAmountValue =
        TransactionType === "buy" ? amount : tokenBalance;

      const response = await AccountsService.getTradeDetails(
        tokenAddress,
        Number(customAmountValue),
        TransactionType,
        getTradePublicKey || "",
        key
      );

      if (!response.data || response.data.swapMode === null) {
        console.log("should be error in the get trade details: ", response);
        throw new Error("No Route Found. Try different amount.");
      }

      const tradeData = {
        selectedSol: Number(customAmountValue),
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
          duration: 8000,
        }
      );

      const result = await executeTrade(key || "", tradeData);

      if (!result.success || !result.signature) {
        throw new Error(result.error || "Trade execution failed");
      }

      const responseSwapData = {
        transactionId: result.signature,
        method: TransactionType,
        wallet: getTradePublicKey || "",
        amount: Number(tradeData.selectedSol),
      };

      toast.custom((t) => (
        <CustomToast
          type="success"
          title={`Your Transaction Id : ${result.signature}`}
          t={t}
          description={`${customAmountValue} has been confirmed`}
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          onClose={() => toast.dismiss(t.id)}
        />
      ));

      mutate(responseSwapData, {
        onSuccess() {
          toast.dismiss(loadingToast);

          // toast.custom((t) => (
          //   <CustomToast
          //     type="success"
          //     title={`Your Transaction Id : ${result.signature}`}
          //     t={t}
          //     description={`${customAmountValue} has been confirmed`}
          //     icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          //     onClose={() => toast.dismiss(t.id)}
          //   />
          // ));

          queryClient.invalidateQueries({ queryKey: ["holdings"] });
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
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        className="  bg-[#39393E]
          rounded-[6px]
          font-semibold
          text-[clamp(10px,1.2vw,14px)]
          !px-[clamp(8px,2vw,28px)]
          !py-[clamp(2px,2vw,12px)]
          flex items-center justify-center gap-[clamp(6px,1.2vw,10px)] "
        onClick={(e: React.MouseEvent) => onSubmit("sell", e)}
        disabled={isSubmitting || isPending}
      >
        <Image
          src={yellowsell}
          alt=""
          className="w-[clamp(16px,3vw,21px)] min-w-[clamp(16px,3vw,21px)] h-[clamp(16px,3vw,21px)]"
        />
        Sell
      </Button>
      <Button
        className="  bg-[#39393E]
          rounded-[6px]
          font-semibold
          text-[clamp(10px,1.2vw,14px)]
         !px-[clamp(8px,2vw,28px)]
          !py-[clamp(2px,2vw,12px)]
          flex items-center justify-center gap-[clamp(6px,1.2vw,10px)]"
        onClick={(e: React.MouseEvent) => onSubmit("buy", e)}
        disabled={isSubmitting || isPending}
      >
        <Image
          src={greenbuy}
          alt=""
          className="w-[clamp(16px,3vw,21px)] min-w-[clamp(16px,3vw,21px)] h-[clamp(16px,3vw,21px)]"
        />
        Buy
      </Button>
    </div>
  );
}

export default QuickBuySellComponent;
