import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import SOLNoCircle from "@public/pics/WithoutCircleSolanaPic.png";
import LessThsnIcon from "@public/pics/BUYSELLLESSIcon.png";
import { useForm } from "react-hook-form";
import { CustomLoader } from "@/components/loader";
import { useSolanaAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { executeTrade } from "@/actions/trade";
import { AccountsService } from "@/api-lib/services/AccountsService";
import {
  useGetBalanceWithoutPooling,
  useSwapDataAfterTrade,
  usePlaceConditionalTrade,
} from "@/api-lib/api-hooks/useAccountsApiHook";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/Context/React-Query-Provider";
import CustomToast from "@/components/CustomToast";
import { CheckCircleIcon, CircleAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const amountOptions = [
  { value: "0.25", label: "0.25" },
  { value: "0.5", label: "0.5" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "5", label: "5" },
];

const DipNames = [{ value: "MarketCapby", label: "Market Cap" }];

interface FormType {
  selectedSol: string;
  buyType: "buynow" | "buydip";
  customAmount: string;
  dipname: "MarketCapby" | "ToMarketCap" | "ByTargetLine";
  dipInpuValue: string;
  expireHours: string;
}

function TokenBuyComponent({ tokenAddress }: { tokenAddress: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);
  const [marketCapBy, setMarketCapBy] = useState(false);

  const key = useSolanaAuthStore((state) => state.key);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const {
    data: BalanceData,
    isLoading,
    isError,
  } = useGetBalanceWithoutPooling(getTradePublicKey || "", key || "");

  const { mutate: placeConditionalTrade, isPending: isPlacingOrder } =
    usePlaceConditionalTrade(key || ""); // For React Query v5

  const { mutate, isPending } = useSwapDataAfterTrade(key || "");

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormType>({
    defaultValues: {
      customAmount: "",
      buyType: "buynow",
      selectedSol: "",
      // marketCapValue: "",
      // solValue: "",
      dipname: "MarketCapby",
      dipInpuValue: "",
    },
  });

  const customAmount = watch("customAmount");
  const selectedSol = watch("selectedSol");
  const orderBuyType = watch("buyType");
  // const DipName = watch("dipname");
  const DipInputValue = watch("dipInpuValue");

  const isBuyNowLoading = isSubmitting && orderBuyType === "buynow";
  const isBuyDipLoading = isPlacingOrder && orderBuyType === "buydip";
  // const marketCapValue = watch("marketCapValue");
  // const solValue = watch("solValue");

  const handleAmountSelect = (value: string) => {
    setValue("selectedSol", value);
    setValue("customAmount", "");
  };

  const handleOrderTypeChange = (value: "buynow" | "buydip") => {
    setValue("buyType", value);
  };

  const toggleMarketCapBy = () => {
    setMarketCapBy(!marketCapBy);
  };

  const onSubmit = async (formData: FormType) => {
    try {
      setIsSubmitting(true);
      if (!key) {
        OpenModalFunc();
        return;
      }
      const amount =
        Number(formData.selectedSol) || Number(formData.customAmount);

      if (formData.buyType === "buydip") {
        const marketCapValue = Number(formData.dipInpuValue);

        if (!marketCapValue || !amount) {
          toast.error("Please enter valid market cap and amount");
          setIsSubmitting(false);
          return;
        }

        placeConditionalTrade(
          {
            tokenAddress,
            marketCap: marketCapValue,
            walletAddress: getTradePublicKey || "",
            amount,
          },
          {
            onSuccess: () => {
              toast.custom((t) => (
                <CustomToast
                  type="success"
                  title="Limit Order Placed"
                  t={t}
                  description={`Order will trigger at market cap ≤ $${marketCapValue}`}
                  icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  onClose={() => toast.dismiss(t.id)}
                />
              ));
              reset();
              setValue("buyType", "buynow");
              handleOrderTypeChange("buynow");
            },
            onError: (error: unknown) => {
              const err = error as Error;

              toast.custom((t) => (
                <CustomToast
                  type="error"
                  title="Failed to Place Order"
                  t={t}
                  description={err?.message || "Something went wrong"}
                  icon={<CircleAlert className="h-6 w-6 text-red-500" />}
                  onClose={() => toast.dismiss(t.id)}
                />
              ));
            },
          }
        );

        return; // Prevents running the "buynow" logic below
      } else {
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
          selectedSol: amount,
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
          amount: amount,
        };
        toast.custom((t) => (
          <CustomToast
            type="success"
            title={`Your Transaction Id : ${result.signature}`}
            t={t}
            description={`${amount} has been confirmed`}
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
            //     description={`${amount} has been confirmed`}
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
      }
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
      reset();
      setValue("buyType", "buynow");
      handleOrderTypeChange("buynow");
      setIsSubmitting(false);
    }
  };

  // Update form values when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("customAmount", value);
    if (value) {
      // Deselect preset amounts when custom amount is entered
      setValue("selectedSol", "");
    } else if (!value && !selectedSol) {
      // If cleared and no preset selected, select first option
      setValue("selectedSol", amountOptions[0].value);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-[clamp(8px,1vw,16px)] flex items-center justify-between gap-[clamp(8px,1vw,16px)] p-[clamp(6px,1vw,16px)] ">
        <RadioGroup
          value={orderBuyType}
          onValueChange={handleOrderTypeChange}
          className="flex gap-[clamp(8px,1vw,16px)]"
        >
          <div className="flex items-center space-x-[clamp(4px,0.5vw,8px)]">
            <RadioGroupItem
              value="buynow"
              id="buynow"
              className="border-[#808080] !w-[clamp(12px,1vw,14px)] !h-[clamp(12px,1vw,14px)] "
            />
            <Label
              htmlFor="buynow"
              className="font-medium text-[clamp(10px,1vw,14px)] leading-[100%] tracking-[0%] text-white"
            >
              Buy Now
            </Label>
          </div>

          <div className="flex items-center space-x-[clamp(4px,0.5vw,8px)]">
            {/* <RadioGroupItem
              value="buydip"
              id="buydip"
              className="border-[#808080] !w-[clamp(12px,1vw,14px)] !h-[clamp(12px,1vw,14px)] "
            />w
            <Label
              htmlFor="buydip"
              className="font-medium text-[clamp(10px,1vw,14px)] leading-[100%] tracking-[0%] text-white"
            >
              Buy Dip
            </Label> */}
          </div>
        </RadioGroup>

        <div className="flex justify-between items-center ">
          <span className="flex justify-between items-center gap-1 text-[#FFFFFFB2] font-medium text-[clamp(10px,1vw,16px)] leading-[100%] tracking-[0%] text-right ">
            Bal:{" "}
            {isLoading ? (
              <Skeleton className="inline w-[20px] h-[16px] " />
            ) : isError ? (
              "error"
            ) : (
              BalanceData?.data.balance
            )}{" "}
            SOL
          </span>
        </div>
      </div>
      {/* ################################################################### */}
      {/* ################################################################### */}
      {/* ################################################################### */}
      {orderBuyType === "buydip" ? (
        <div className="mb-[clamp(12px,2vw,24px)] space-y-4">
          {/* Market Cap settings */}
          <div className=" rounded-[6px] h-[58px] flex item-stretch border-[1px] border-solid border-[#FFFFFF14]  ">
            <Select onValueChange={toggleMarketCapBy}>
              <SelectTrigger className=" h-full w-[30%]   focus-visible:ring-0 focus-visible:ring-offset-0 border-none   bg-transparent !text-white [&>span]:font-normal [&>span]:text-[14px] [&>span]:leading-[100%] [&>span]:tracking-[0%] [&>span]:!overflow-[unset] ">
                <SelectValue
                  className="text-white [&>span]:font-normal [&>span]:text-[14px] [&>span]:leading-[100%] [&>span]:tracking-[0%] [&>span]:!overflow-[unset]  "
                  placeholder={DipNames[0].label}
                />
              </SelectTrigger>
              <SelectContent className=" !bg-black bg-opacity-80 border-none !text-white !font-normal !text-[14px] leading-[100%] tracking-[0%]  ">
                {DipNames.map((dipname) => {
                  return (
                    <SelectItem
                      className="!text-white hover:!bg-[#ffffff3b] !font-normal !text-[14px] leading-[100%] tracking-[0%] focus:!bg-[#ffffff3b]  "
                      key={dipname.value}
                      value={dipname.value}
                    >
                      {dipname.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className=" pr-4 pl-[2rem] w-[70%] h-full border-t-0 border-r-0 border-b-0 border-l border-[#FFFFFF14]   flex items-center ">
              <Image
                src={LessThsnIcon}
                alt=""
                className=" w-[10px] h-[19px]  "
              />
              <Input
                {...register("dipInpuValue")}
                className=" pl-[1rem] placeholder:!text-[#FFFFFFCC] focus-visible:ring-0 focus-visible:ring-offset-0 w-full bg-transparent !font-semibold !text-[15.61px] leading-[100%] tracking-[0%] text-left  h-full !border-none "
                placeholder="20"
              />
            </div>
          </div>
          <div className=" flex items-center gap-4  ">
            {/* Expire In section */}
            {/* <div className=" w-[180px] rounded-[6px] h-[58px] flex item-stretch border-[1px] border-solid border-[#FFFFFF14] ">
              <div className=" flex items-center justify-center align-middle w-[50%] h-full !font-semibold !text-[15.61px] leading-[100%] tracking-[0%] !text-center  border-r border-[#FFFFFF14]  ">
                Expire In
              </div>
              <Input
                className=" w-[50%] placeholder:!text-[#FFFFFFCC] focus-visible:ring-0 focus-visible:ring-offset-0 l bg-transparent !font-semibold !text-[15.61px] leading-[100%] tracking-[0%] !text-center  h-full !border-none "
                placeholder="24hrs"
              />
            </div> */}

            {/* Triggers section */}
            <div className="">
              <div className="mb-1">
                <span className="font-bold text-[14px] leading-[100%] tracking-[0%]">
                  Triggers on:
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <div className="flex items-center">
                  <span className="text-white font-medium text-[12px] leading-[100%] tracking-[0%]">
                    MC ≤ $
                  </span>
                  {DipInputValue && <span>{DipInputValue}</span>}
                </div>
                <span className="text-white font-medium">,</span>
                {/* <div className="flex items-center"> */}
                {/* <span className="text-white font-medium text-[12px] leading-[100%] tracking-[0%]">
                    SOL ≤{" "}
                  </span> */}
                {/* test  */}
                {/* {DipInputValue && <span>{DipInputValue}</span>}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* ################################################################### */}
      {/* ################################################################### */}
      {/* ################################################################### */}
      <div className="mb-[clamp(12px,2vw,24px)]  border border-[#FFFFFF30] overflow-hidden rounded-[8px] ">
        <div className="flex justify-between items-center ">
          <Label className="h-[clamp(48px,6vw,60px)] w-full relative  ">
            <Input
              type="number"
              placeholder="Amount"
              className=" pl-[clamp(16px,2vw,24px)] pr-[5rem] placeholder:text-[#FFFFFFB2] !text-white !font-semibold !text-[clamp(14px,1.6vw,16px)] !leading-[100%] !tracking-[0%] h-[clamp(48px,6vw,60px)] w-full rounded-[8px] bg-[#1A1A1C] border-none border-b border-[#FFFFFF30] focus-visible:ring-0 focus-visible:ring-offset-0 "
              {...register("customAmount", {
                min: {
                  value: 0.00000001,
                  message: "Amount must be greater than 0",
                },
              })}
              onChange={handleInputChange}
              step={0.00000001}
              min={0.00000001}
              max={Number(BalanceData?.data.balance) || 100000}
            />
            <span className="absolute right-6 top-[50%] translate-y-[-50%] text-[#FFFFFFB2] !font-semibold !text-[clamp(14px,1.6vw,16px)] !leading-[100%] !tracking-[0%] ">
              SOL
            </span>
          </Label>
        </div>
        <div className="grid grid-cols-5   ">
          {amountOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`relative  font-semibold h-[clamp(30px,45px,59px)]  text-[clamp(10px,1.5vw,15.66px)] leading-[100%] tracking-[0%] text-center text-[#FFFFFFCC] bg-transparent !rounded-none border-b-0 border-l-0 border-t-0 border-r border-r-[#FFFFFF30] last:border-r-none  overflow-hidden  hover:text-[unset] hover:bg-transparent  ${
                selectedSol === option.value
                  ? " bg-[#ffffff38] hover:bg-[#ffffff38]"
                  : "hover:bg-transparent "
              }`}
              onClick={() => handleAmountSelect(option.value)}
              type="button"
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
      </div>
      <Button
        className={cn(
          "w-full bg-[#232323] hover:bg-[#16a34a] text-[#5F5F5F] rounded-[8px] hover:text-white font-semibold text-[clamp(16px,2vw,19.58px)] leading-[100%] tracking-[0%] text-center py-[clamp(16px,3vw,24px)] ",
          selectedSol || customAmount ? "bg-[#16a34a] text-white  " : ""
        )}
        disabled={
          isSubmitting || isPending || (!customAmount && !selectedSol) || !key
        }
      >
        {!key
          ? "Connect Wallet"
          : orderBuyType === "buydip"
          ? isBuyDipLoading
            ? "Placing Order..."
            : "Place Order"
          : isBuyNowLoading
          ? "Processing..."
          : "Buy"}
        {isSubmitting && <CustomLoader size={"md"} variant={"white"} />}
      </Button>
      <p className="text-white font-normal text-[clamp(10px,1.2vw,11.75px)] leading-[100%] tracking-[0%] text-center mt-4">
        Once you click on Buy, your transaction is sent immediately.
      </p>
    </form>
  );
}

export default TokenBuyComponent;
