"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSolanaAuthStore } from "@/store/auth";
import { useForm } from "react-hook-form";
import { useWithdraw } from "@/api-lib/api-hooks/useAccountsApiHook";
import toast from "react-hot-toast";
import { CustomLoader } from "@/components/loader";
import { queryClient } from "@/Context/React-Query-Provider";
import CustomToast from "@/components/CustomToast";
import { CheckCircleIcon, CircleAlert } from "lucide-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SOLWalletConnection } from "@/trade-functions/SOLConnections";

import { useDepositTXData } from "@/api-lib/api-hooks/useAccountsApiHook";

// Define the form data structure
interface WithdrawFormData {
  walletfrom: string;
  amount: number;
  walletto: string;
  priorityFee: number;
}

type TxData = {
  senderAddress: string;
  receiverAddress: string;
  txId: string;
  amount: number;
  dateTime: string;
};

type PhantomProvider = NonNullable<Window["phantom"]>["solana"];

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

function WithdrawForm() {
  const key = useSolanaAuthStore().key;
  const getTradePublicKey = useSolanaAuthStore().getTradePublicKey;
  const solpublicKey = useSolanaAuthStore((state) => state.solpublicKey);

  const [isLoading, setIsLoading] = useState(false);
  const [phantomProvider, setPhantomProvider] =
    useState<PhantomProvider | null>(null);
  const [phantomError, setPhantomError] = useState<string | null>(null);

  const [swap, setSwap] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WithdrawFormData>({
    defaultValues: {
      walletfrom: getTradePublicKey || "",
      amount: 0,
      walletto: solpublicKey || "",
      priorityFee: 0.0001,
    },
  });

  // Initialize the withdraw mutation
  const {
    mutateAsync,
    error: backenderror,
    isPending,
  } = useWithdraw(key || "");

  const { mutate: depositTx, isPending: isDepositing } = useDepositTXData(
    key || ""
  );

  useEffect(() => {
    if (!isMobile() && window?.phantom?.solana) {
      const provider = window.phantom.solana;
      if (provider.isPhantom) {
        setPhantomProvider(provider);
      }
    }
  }, []);
  // Check if Phantom wallet is available

  useEffect(() => {
    const checkPhantomWallet = async () => {
      if (window && window.phantom?.solana) {
        const provider = window.phantom.solana;
        if (provider.isPhantom) {
          const newPhantomPublicKey = (
            await provider.connect()
          ).publicKey.toBase58();
          if (newPhantomPublicKey !== solpublicKey) {
            setPhantomError(
              `Please select the correct Phantom account. Current account : ${newPhantomPublicKey}`
            );
            setPhantomProvider(null);
          } else {
            setPhantomError(null);
            setPhantomProvider(provider);
          }
        }
      }
    };

    checkPhantomWallet();
  }, [solpublicKey]);

  // Process the deposit
  const executeTransaction = async (data: { amount: number }) => {
    if (!solpublicKey || !getTradePublicKey) {
      toast.custom((t) => (
        <CustomToast
          type="error"
          title="Wallet not connected!"
          t={t}
          description={"Please try again or check wallet connection"}
          icon={<CircleAlert className="h-6 w-6 text-red-500" />}
          onClose={() => toast.dismiss(t.id)}
        />
      ));

      return;
    }

    if (phantomError) {
      toast.custom((t) => {
        return (
          <CustomToast
            title={phantomError}
            type="error"
            key={t.id}
            onClose={() => toast.dismiss(t.id)}
            t={t}
          />
        );
      });
      return;
    }

    if (data.amount <= 0) {
      toast.custom((t) => (
        <CustomToast
          type="error"
          title="Invalid amount!"
          t={t}
          description={"Please enter a valid amount!"}
          icon={<CircleAlert className="h-6 w-6 text-red-500" />}
          onClose={() => toast.dismiss(t.id)}
        />
      ));

      return;
    }
    setIsLoading(true);

    try {
      const { blockhash, lastValidBlockHeight } =
        await SOLWalletConnection.getLatestBlockhash("confirmed");

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(solpublicKey),
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solpublicKey),
          toPubkey: new PublicKey(getTradePublicKey),
          lamports: BigInt(data.amount * LAMPORTS_PER_SOL),
        })
      );

      if (isMobile()) {
        const serialized = transaction.serialize({
          verifySignatures: false,
          requireAllSignatures: false,
        });
        const base64Tx = serialized.toString("base64");
        const redirect = encodeURIComponent(
          "https://get-trade-app.vercel.app/phantom-connect/tx-handler"
        );

        localStorage.setItem(
          "phantom-tx-in-flight",
          JSON.stringify({
            blockhash,
            lastValidBlockHeight,
            from: solpublicKey,
            to: getTradePublicKey,
            amount: data.amount,
          })
        );

        const url = `https://phantom.app/ul/v1/signAndSendTransaction?app_url=https://get-trade-app.vercel.app&redirect_link=${redirect}&transaction=${base64Tx}`;
        window.location.href = url;

        return undefined;
      }

      const signed = await phantomProvider!.signTransaction(transaction);
      const signature = await SOLWalletConnection.sendRawTransaction(
        signed.serialize()
      );

      await SOLWalletConnection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      const txData: TxData = {
        senderAddress: solpublicKey,
        receiverAddress: getTradePublicKey,
        txId: signature,
        amount: data.amount,
        dateTime: new Date().toISOString(),
      };

      return txData;
    } catch (err) {
      console.error("Transaction error:", err);
      toast.error("Transaction failed.");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission handler
  const onSubmit = async (data: WithdrawFormData) => {
    // if swap is true, means I am sending sol from sol wallet to get-trade wallet via blockchain.
    if (swap) {
      data.walletfrom = solpublicKey || "";
      data.walletto = getTradePublicKey || "";
      // Create loading toast
      const loadingToast = toast.custom(
        (t) => (
          <CustomToast
            type="info"
            title="Processing Solana Transaction"
            t={t}
            description="Please wait while your transaction is being processed..."
            icon={<CustomLoader size={"sm"} variant={"info"} />}
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: 36000,
        }
      );

      const txData = await executeTransaction({ amount: data.amount });

      if (!txData) {
        toast.dismiss(loadingToast);
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Transaction Failed"
            t={t}
            description="No transaction data returned"
            icon={<CircleAlert className="h-6 w-6 text-red-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        return;
      }
      // Success toast for the transaction
      toast.dismiss(loadingToast);
      toast.custom(
        (t) => (
          <CustomToast
            type="success"
            title="Transaction Confirmed"
            t={t}
            description="Transaction confirmed successfully!"
            icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: 2000,
        }
      );

      // Handle the backend deposit separately
      await depositTx(txData, {
        onSuccess: () => {
          toast.custom((t) => (
            <CustomToast
              type="success"
              title="Deposit Posted Successfully!"
              t={t}
              description={`${data.amount} has been confirmed`}
              icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
              onClose={() => toast.dismiss(t.id)}
            />
          ));

          queryClient.invalidateQueries({
            queryKey: ["depositTXData"],
            exact: false,
          });
          reset();
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to record deposit:";
          toast.custom((t) => (
            <CustomToast
              type="error"
              title="Transaction Failed"
              t={t}
              description={errorMessage}
              icon={<CircleAlert className="h-6 w-6 text-red-500" />}
              onClose={() => toast.dismiss(t.id)}
            />
          ));
          // toast.error("Failed to record deposit: " + errorMessage, {
          //   duration: 5000,
          //   icon: "⚠️",
          //   style: {
          //     borderRadius: "10px",
          //     background: "#333",
          //     color: "#fff",
          //   },
          // });
        },
      });
    }

    // if swap is false, means I am sending sol from get-trade wallet to sol wallet via backend.
    if (!swap) {
      try {
        //

        await mutateAsync({
          address: getTradePublicKey || "",
          amount: data.amount,
        });

        queryClient.invalidateQueries({ queryKey: ["withdrawHistory"] });
        queryClient.invalidateQueries({
          queryKey: ["firstbalance"],
          exact: false,
        });

        toast.custom((t) => (
          <CustomToast
            type="success"
            title="Withdrawal Successful"
            t={t}
            description={
              "Your withdrawal was successful. Please wait for the transaction to be confirmed."
            }
            icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
      } catch (error) {
        console.error("Withdrawal failed:", error);
        toast.custom((t) => (
          <CustomToast
            type="error"
            title="Transaction Failed"
            t={t}
            description={
              backenderror?.message || backenderror?.name || "Withdrawal failed"
            }
            icon={<CircleAlert className="h-6 w-6 text-red-500" />}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
      }
    }
    reset();
  };

  // Format wallet address
  const formatWalletAddress = useCallback((address: string) => {
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }, []);

  const getTradePublicK = formatWalletAddress(getTradePublicKey || "");
  const solpublicK = formatWalletAddress(solpublicKey || "");

  return (
    <div>
      <div className=" flex items-center justify-between flex-wrap gap-4 lg:my-[2rem] my-[1rem]">
        <h5 className=" text-[#D9D9D9]  ">
          Withdraw from Get. Trading wallet to your selected wallet. Please keep
          a balance of 0.0025SOL + priority fee for the withdraw to be
          successful.
        </h5>
        <div
          onClick={() => setSwap(!swap)}
          className=" w-[162px] h-[46px] p-[1px] rounded-[6px] bg-[linear-gradient(180deg,_#4FED7E_0%,_#E90AF9_100%)]    "
        >
          <div className="  w-full h-full bg-[#000000] rounded-[6px] flex items-center justify-center">
            <Button
              className=" font-PoppinsFont font-medium text-[16.98px] leading-[100%] tracking-[0%] rounded-[6px] w-full h-full
         bg-[linear-gradient(256.05deg,_#F001FF_12.39%,_#4CF37B_76.55%)] bg-clip-text text-transparent
          "
            >
              Swap
              {/* {swap ? "true" : "false"} */}
            </Button>
          </div>
        </div>
      </div>
      <form
        className="grid gap-4 lg:pt-[6rem] pt-[3rem] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1  lg:grid-cols-4 sm:grid-cols-2 lg:gap-3 gap-6">
          <div className="space-y-2">
            <label className="text-white md:text-[20px] text-[16px] font-bold leading-[24.76px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              Wallet From
            </label>

            <div className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] border-[1px] border-solid flex items-center bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]">
              {!swap ? getTradePublicK : solpublicK}
            </div>
            {/* <Input
            {...register("walletfrom")}
            value={getTradePublicK}
            readOnly
            className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]"
          /> */}
            {errors.walletfrom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.walletfrom.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-white md:text-[20px] text-[16px] font-bold leading-[24.76px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              AMOUNT
            </label>
            <Input
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.000001,
                  message: "Amount must be greater than 0",
                },
                valueAsNumber: true,
              })}
              type="number"
              step="0.000001"
              className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-white md:text-[20px] text-[16px] font-bold leading-[24.76px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              Withdraw To
            </label>
            <div className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] border-[1px] border-solid flex items-center bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]">
              {!swap ? solpublicK : getTradePublicK}
            </div>
            {/* <Input
            readOnly
            {...register("walletto", {
              required: "Destination wallet is required",
              pattern: {
                value: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
                message: "Please enter a valid Solana wallet address",
              },
            })}
            value={solpublicK}
            className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]"
          /> */}
            {errors.walletto && (
              <p className="text-red-500 text-sm mt-1">
                {errors.walletto.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-white md:text-[20px] text-[16px] font-bold leading-[24.76px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              PRIORITY FEE (MIN)
            </label>
            <Input
              {...register("priorityFee", {
                required: "Priority fee is required",
                min: { value: 0, message: "Fee cannot be negative" },
                valueAsNumber: true,
              })}
              type="number"
              min={0}
              step={"any"}
              className="!text-[clamp(16px,2vw,18px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]"
            />
            {errors.priorityFee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priorityFee.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex md:justify-end justify-center md:ml-auto md:mt-[2rem] mt-[1rem]">
          <Button
            className="bg-[#4CF37B] rounded-[12px] font-semibold text-[clamp(14px,2vw,16px)] leading-[100%] tracking-[0%] text-black h-[clamp(40px,5vw,55px)] w-[clamp(120px,10vw,147px)]"
            type="submit"
            disabled={isSubmitting || isPending || isLoading || isDepositing}
          >
            Send
            {isSubmitting || isPending || isLoading || isDepositing ? (
              <CustomLoader size={"md"} variant={"dark"} />
            ) : (
              ""
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default WithdrawForm;
