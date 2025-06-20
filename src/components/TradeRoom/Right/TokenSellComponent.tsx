import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSolanaAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { CustomLoader } from "@/components/loader";
import {
  useGetTokenBalance,
  useSwapDataAfterTrade,
} from "@/api-lib/api-hooks/useAccountsApiHook";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountsService } from "@/api-lib/services/AccountsService";
import { executeTrade } from "@/actions/trade";
import { queryClient } from "@/Context/React-Query-Provider";
import CustomToast from "@/components/CustomToast";
import { CheckCircleIcon, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
const selltOptions = [
  { value: "0.15", label: "15%" },
  { value: "0.25", label: "25%" },
  { value: "0.50", label: "50%" },
  { value: "0.75", label: "75%" },
  { value: "1", label: "100%" },
];

interface FormType {
  selectedSol: string;
  sellType: "sellnow" | "selldip";
  customAmount: string;
}

function TokenSellComponent({ tokenAddress }: { tokenAddress: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const key = useSolanaAuthStore((state) => state.key);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const {
    data: TokenBalance,
    isLoading,
    isError,
  } = useGetTokenBalance(tokenAddress, getTradePublicKey || "", key || "");

  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormType>({
    defaultValues: {
      customAmount: "",
      sellType: "sellnow",
      selectedSol: "",
    },
  });

  const customAmount = watch("customAmount");
  const selectedSol = watch("selectedSol");
  const orderSellType = watch("sellType");

  const handleAmountSelect = (value: string) => {
    setValue("selectedSol", value);
    setValue("customAmount", "");
  };

  const handleOrderTypeChange = (value: "sellnow" | "selldip") => {
    setValue("sellType", value);
  };

  const { mutate, isPending } = useSwapDataAfterTrade(key || "");
  // Update form values when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("customAmount", value);
    if (value) {
      // Deselect preset amounts when custom amount is entered
      setValue("selectedSol", "");
    } else if (!value && !selectedSol) {
      // If cleared and no preset selected, select first option
      setValue("selectedSol", selltOptions[0].value);
    }
  };

  const onSubmit = async (formData: FormType) => {
    try {
      if (!key) {
        OpenModalFunc();
        return;
      }

      setIsSubmitting(true);

      // const whenSelectedValue =
      //   typeof TokenBalance?.data === "number"
      //     ? formData.selectedSol === "100"
      //       ? TokenBalance.data * Number(formData.selectedSol)
      //       : (TokenBalance.data * Number(formData.selectedSol)).toFixed(4) ||
      //         Number(formData.customAmount)
      //     : 0;

      const whenSelectedValue =
        typeof TokenBalance?.data === "number"
          ? formData.customAmount
            ? Number(formData.customAmount)
            : formData.selectedSol === "1"
            ? TokenBalance.data * Number(formData.selectedSol)
            : (TokenBalance.data * Number(formData.selectedSol)).toFixed(4)
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
        amount: Number(whenSelectedValue),
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
          // toast.custom((t) => (
          //   <CustomToast
          //     type="success"
          //     title="Trade Executed Successfully"
          //     t={t}
          //     description={`${
          //       Number(whenSelectedValue) || Number(formData.customAmount)
          //     } has been confirmed`}
          //     icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          //     onClose={() => toast.dismiss(t.id)}
          //   />
          // ));
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
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="   ">
      <div className="mb-[clamp(8px,1vw,16px)] flex items-center justify-between gap-[clamp(8px,1vw,16px)] p-[clamp(6px,1vw,16px)] ">
        <RadioGroup
          value={orderSellType}
          onValueChange={handleOrderTypeChange}
          className="flex gap-[clamp(8px,1vw,16px)]"
        >
          <div className="flex items-center space-x-[clamp(4px,0.5vw,8px)]">
            <RadioGroupItem
              value="sellnow"
              id="sellnow"
              className="border-[#808080] !w-[clamp(12px,1vw,14px)] !h-[clamp(12px,1vw,14px)] "
            />
            <Label
              htmlFor="sellnow"
              className="font-medium text-[clamp(10px,1.4vw,14px)] leading-[100%] tracking-[0%] text-white"
            >
              Sell Now
            </Label>
          </div>
          {/* <div className="flex items-center space-x-[clamp(4px,0.5vw,8px)]">
            <RadioGroupItem
              value="dip"
              id="selldip"
              className="border-[#808080] !w-[clamp(12px,1vw,14px)] !h-[clamp(12px,1vw,14px)] "
            />
            <Label
              htmlFor="selldip"
              className="font-medium text-[clamp(12px,1.4vw,14px)] leading-[100%] tracking-[0%] text-white"
            >
              Sell Dip
            </Label>
          </div> */}
        </RadioGroup>
        <div className="flex  justify-between items-center gap-1 text-[clamp(10px,1vw,16px)] ">
          <span className="flex justify-between items-center gap-1 text-[#FFFFFFB2] font-medium text-[clamp(10px,1vw,16px)] leading-[100%] tracking-[0%] text-right ">
            Bal:{" "}
            {isLoading ? (
              <Skeleton className=" inline-block w-[20px] h-[16px] " />
            ) : isError ? (
              "error"
            ) : (
              TokenBalance?.data.toFixed(6)
            )}{" "}
          </span>
          Tokens
        </div>
      </div>
      <div className="mb-[clamp(12px,2vw,24px)]  border border-[#FFFFFF30] overflow-hidden rounded-[8px] ">
        <div className="flex justify-between items-center ">
          <Label className="h-[clamp(48px,6vw,60px)] w-full relative  ">
            <Input
              type="number"
              placeholder="Amount"
              className=" pl-[clamp(16px,2vw,24px)] pr-[5rem] placeholder:text-[#FFFFFFB2] !text-white !font-semibold !text-[clamp(14px,1.6vw,16px)] !leading-[100%] !tracking-[0%] h-[clamp(48px,6vw,60px)] w-full rounded-[8px] bg-[#1A1A1C] border-none border-b border-[#FFFFFF30] focus-visible:ring-0 focus-visible:ring-offset-0 "
              {...register("customAmount")}
              onChange={handleInputChange}
              step="any"
              min={0}
              // min={0.00000001}
              // max={Number(TokenBalance?.data) + 0.00000001 || 100000000}
            />
            <span className="absolute right-6 top-[50%] translate-y-[-50%] text-[#FFFFFFB2] !font-semibold !text-[clamp(14px,1.6vw,16px)] !leading-[100%] !tracking-[0%] ">
              Tokens
            </span>
          </Label>
        </div>
        <div className="grid grid-cols-5  ">
          {selltOptions.map((option) => (
            <Button
              type="button"
              key={option.value}
              variant="outline"
              className={`relative font-semibold h-[clamp(30px,45px,59px)]  text-[clamp(10px,1.5vw,15.66px)] leading-[100%] tracking-[0%] text-center text-[#FFFFFFCC] bg-transparent !rounded-none border-b-0 border-l-0 border-t-0  border-r border-r-[#FFFFFF30] last:border-r-none  overflow-hidden  hover:text-[unset]   ${
                selectedSol === option.value
                  ? " hover:bg-[#ffffff38]  bg-[#ffffff38]"
                  : "hover:bg-transparent "
              }`}
              onClick={() => handleAmountSelect(option.value)}
            >
              <div className="flex items-center justify-center gap-[clamp(4px,0.5vw,8px)]  ">
                <span>{option.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
      <Button
        className={cn(
          "w-full bg-[#232323] hover:bg-[#E1414A] text-[#5F5F5F] rounded-[8px] hover:text-white font-semibold text-[clamp(16px,2vw,19.58px)] leading-[100%] tracking-[0%] text-center py-[clamp(16px,3vw,24px)] ",
          selectedSol || customAmount ? "bg-[#E1414A] text-white  " : ""
        )}
        disabled={
          isSubmitting || isPending || (!customAmount && !selectedSol) || !key
        }
      >
        {!key ? "Connect Wallet" : "Sell"}
        {isSubmitting && <CustomLoader size={"md"} variant={"white"} />}
      </Button>
      <p className="text-white font-normal text-[clamp(10px,1.2vw,11.75px)] leading-[100%] tracking-[0%] text-center mt-4">
        Once you click on Sell, your transaction is sent immediately.
      </p>
    </form>
  );
}

export default TokenSellComponent;
