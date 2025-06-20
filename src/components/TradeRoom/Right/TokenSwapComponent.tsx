"use client";

import { Button } from "@/components/ui/button";
import TokenStringShortener from "@/helpers/TokenStringShortener";
import { useSolanaAuthStore } from "@/store/auth";
import walletss from "@public/pics/empty-wallet.png";
import copy from "@public/pics/document-copy.svg";
import Image from "next/image";
import { CopyButton } from "@/components/CopyButton";
import {
  useGetTokenBalance,
  useSwapDataAfterTrade,
} from "@/api-lib/api-hooks/useAccountsApiHook";
import { useForm } from "react-hook-form";
import SOLNoCircle from "@public/pics/WithoutCircleSolanaPic.png";
import { useState } from "react";
import { AccountsService } from "@/api-lib/services/AccountsService";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import { CustomLoader } from "@/components/loader";
import { executeTrade } from "@/actions/trade";
import { CheckCircleIcon, CircleAlert } from "lucide-react";
import { queryClient } from "@/Context/React-Query-Provider";

const amountOptions = [
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "5", label: "5" },
];

interface BuyFormType {
  buyAmount: string;
}

const selltOptions = [
  { value: "0.15", label: "15%" },
  { value: "0.25", label: "25%" },
  { value: "0.50", label: "50%" },
  { value: "0.75", label: "75%" },
  { value: "1", label: "100%" },
];

interface SellFormType {
  selectedSoltoSell: string;
}

const TokenSwapComponent = ({ tokenAddress }: { tokenAddress: string }) => {
  const key = useSolanaAuthStore((state) => state.key);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);
  const { data: TokenBalance } = useGetTokenBalance(
    tokenAddress,
    getTradePublicKey || "",
    key || ""
  );

  const { mutate, isPending } = useSwapDataAfterTrade(key || "");

  const {
    handleSubmit: buyhandleSubmit,
    setValue: buysetValue,
    watch: buyWatch,
    reset: buyReset,
  } = useForm<BuyFormType>({
    defaultValues: {
      buyAmount: "",
    },
  });

  const {
    handleSubmit: sellhandleSubmit,
    setValue: sellsetValue,
    watch: sellWatch,
    reset: sellReset,
  } = useForm<SellFormType>({
    defaultValues: {
      selectedSoltoSell: "",
    },
  });

  const buyAmount = buyWatch("buyAmount");
  const sellAmount = sellWatch("selectedSoltoSell");

  const handleBuyAmountSelect = (value: string) => {
    buysetValue("buyAmount", value);
  };

  const handleSellAmountSelect = (value: string) => {
    sellsetValue("selectedSoltoSell", value);
  };

  const onBuySubmit = async (formData: BuyFormType) => {
    try {
      setIsSubmitting(true);
      if (!key) {
        OpenModalFunc();
        return;
      }
      const amount = Number(formData.buyAmount);

      console.log("amount in number : ", amount);

      const response = await AccountsService.getTradeDetails(
        tokenAddress,
        amount,
        "buy",
        getTradePublicKey || "",
        key
      );

      if (!response.data || response.data.swapMode === null) {
        console.log("should be error in the get trade details: ", response);
        throw new Error("No Route Found. Try different amount.");
      }

      const tradeData = {
        selectedSol: formData.buyAmount,
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
      buyReset();
      buysetValue("buyAmount", "");
    }
  };

  const onSellSubmit = async (formData: SellFormType) => {
    try {
      if (!key) {
        OpenModalFunc();
        return;
      }

      setIsSubmitting(true);

      const whenSelectedValue =
        typeof TokenBalance?.data === "number"
          ? formData.selectedSoltoSell === "1"
            ? TokenBalance.data * Number(formData.selectedSoltoSell)
            : (TokenBalance.data * Number(formData.selectedSoltoSell)).toFixed(
                4
              )
          : 0;

      console.log("percentage value of sell: ", whenSelectedValue);

      const response = await AccountsService.getTradeDetails(
        tokenAddress,
        Number(whenSelectedValue),
        "sell",
        getTradePublicKey || "",
        key
      );

      if (!response.data || response.data.swapMode === null) {
        console.log("should be error in the get trade details: ", response);
        throw new Error("No Route Found. Try different amount.");
      }

      const tradeData = {
        selectedSol: whenSelectedValue,
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
        method: "sell",
        wallet: getTradePublicKey || "",
        amount: Number(tradeData.selectedSol),
      };

      toast.custom((t) => (
        <CustomToast
          type="success"
          title={`Your Transaction Id : ${result.signature}`}
          t={t}
          description={`${Number(whenSelectedValue)} has been confirmed`}
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          onClose={() => toast.dismiss(t.id)}
        />
      ));

      mutate(responseSwapData, {
        onSuccess() {
          toast.dismiss(loadingToast);

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
      sellReset();
      sellsetValue("selectedSoltoSell", "");
    }
  };

  return (
    <div className="w-full mx-auto   px-[clamp(1rem,2vw,1.2rem)] md:pb-[1rem] ">
      <div className="flex gap-1 items-center justify-between ">
        <div className="flex gap-1 items-center">
          <Image src={walletss} alt="wallet" />
          <h3 className=" font-medium text-[14px] leading-[100%] tracking-[0%] text-white ">
            Wallet 2
          </h3>
        </div>
        <div className="flex items-center">
          <h3 className=" font-medium text-[14px] leading-[100%] tracking-[0%] text-[#FFFFFFB2] ">
            <TokenStringShortener originalString={getTradePublicKey || ""} />
          </h3>
          <CopyButton
            text={getTradePublicKey || ""}
            className="!px-[clamp(2px,4vw,4px)] !py-[clamp(2px,4vw,4px)] rounded-[2px] bg-transparent"
          >
            <div className="relative w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)]">
              <Image src={copy} fill alt="copy" />
            </div>
          </CopyButton>
        </div>
      </div>
      {/* buy seacction */}
      <form
        onSubmit={buyhandleSubmit(onBuySubmit)}
        className="md:py-[2rem] md:pt-[2rem] pt-[1rem] space-y-4  "
      >
        <h3 className="text-[#FFFFFFB2] font-semibold text-[clamp(12px,1vw,16px)] leading-[100%] tracking-[0%] text-left ">
          Quick Buy
        </h3>
        <div className="grid grid-cols-5  rounded-[8px] border-[1px] border-solid border-[#FFFFFF30] ">
          {amountOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`relative font-semibold h-[clamp(30px,45px,59px)]  text-[clamp(10px,1.5vw,15.66px)] leading-[100%] tracking-[0%] text-center text-[#FFFFFFCC] bg-transparent !rounded-none border-b-0 border-l-0 border-t-0 last:border-r-0 !border-r !border-r-[#FFFFFF30] last:border-r-none  overflow-hidden  hover:text-[unset] hover:bg-transparent  ${
                buyAmount === option.value
                  ? " bg-[#ffffff38] hover:bg-[#ffffff38]"
                  : "hover:bg-transparent "
              }`}
              onClick={() => handleBuyAmountSelect(option.value)}
              type="submit"
              disabled={isSubmitting || isPending}
            >
              <div className="flex items-center justify-center gap-[clamp(4px,0.5vw,8px)]  ">
                <Image
                  src={SOLNoCircle}
                  alt=""
                  className=" w-[clamp(14px,2vw,18px)] h-[clamp(12,2vw,15px)]  "
                />
                <span>{option.value}</span>
              </div>
            </Button>
          ))}
        </div>
      </form>
      {/* sell section */}

      <form
        onSubmit={sellhandleSubmit(onSellSubmit)}
        className="md:pb-[2rem] pb-[1rem] pt-[1rem] space-y-4  "
      >
        <h3 className="text-[#FFFFFFB2] font-semibold text-[clamp(12px,1vw,16px)] leading-[100%] tracking-[0%] text-left ">
          Quick Sell
        </h3>
        <div className="grid grid-cols-5  rounded-[8px] border-[1px] border-solid border-[#FFFFFF30] ">
          {selltOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`relative font-semibold h-[clamp(30px,45px,59px)]  text-[clamp(10px,1.5vw,15.66px)] leading-[100%] tracking-[0%] text-center text-[#FFFFFFCC] bg-transparent !rounded-none border-b-0 border-l-0 border-t-0 last:border-r-0 !border-r !border-r-[#FFFFFF30] last:border-r-none  overflow-hidden  hover:text-[unset] hover:bg-transparent  ${
                sellAmount === option.value
                  ? " bg-[#ffffff38] hover:bg-[#ffffff38]"
                  : "hover:bg-transparent "
              }`}
              onClick={() => handleSellAmountSelect(option.value)}
              type="submit"
              disabled={isSubmitting || isPending}
            >
              <div className="flex items-center justify-center gap-[clamp(4px,0.5vw,8px)]  ">
                <span>{option.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </form>

      <Button
        className="w-full bg-[#4CF37B] rounded-[8px] text-[#000000] font-semibold text-[clamp(16px,2vw,19.58px)] disabled:pointer-events-none disabled:opacity-100  leading-[100%] tracking-[0%] text-center py-[clamp(16px,3vw,24px)] "
        disabled
      >
        {!key ? "Connect Wallet" : " Wallet Connected"}
      </Button>
    </div>
  );
};

export default TokenSwapComponent;
