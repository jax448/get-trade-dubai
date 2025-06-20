"use client";
import React, { memo, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useSolanaAuthStore } from "@/store/auth";
import { useDepositTXData } from "@/api-lib/api-hooks/useAccountsApiHook";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CustomLoader } from "@/components/loader";
import { SOLWalletConnection } from "@/trade-functions/SOLConnections";
import CustomToast from "@/components/CustomToast";
import { queryClient } from "@/Context/React-Query-Provider";
import { CheckCircleIcon, CircleAlert } from "lucide-react";

import solImg from "@public/pics/WithoutCircleSolanaPic.png";
import Image from "next/image";
import DepositQrCode from "./DepositQrCode";

interface DepositFormData {
  amount: number;
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

function DepositForm() {
  const key = useSolanaAuthStore().key;
  const getTradePublicKey = useSolanaAuthStore().getTradePublicKey;
  const solpublickey = useSolanaAuthStore().solpublicKey;

  const [isLoading, setIsLoading] = useState(false);
  const [phantomProvider, setPhantomProvider] =
    useState<PhantomProvider | null>(null);
  const [phantomError, setPhantomError] = useState<string | null>(null);
  // Use the mutation hook with the API key from store
  const { mutate: depositTx, isPending: isDepositing } = useDepositTXData(
    key || ""
  );

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<DepositFormData>({
    defaultValues: {
      amount: 0,
    },
  });

  // Watch the amount field
  const amount = watch("amount");

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
          if (newPhantomPublicKey !== solpublickey) {
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
  }, [solpublickey]);

  // Process the deposit
  const executeTransaction = async (data: DepositFormData) => {
    if (!solpublickey || !getTradePublicKey) {
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
      // toast.error("Wallet not connected!", {
      //   duration: 5000,
      //   icon: "🦄",
      //   style: {
      //     borderRadius: "10px",
      //     background: "#333",
      //     color: "#fff",
      //   },
      // });
      // Open connection modal if not connected
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
      // toast.error("Please enter a valid amount!", {
      //   duration: 5000,
      //   icon: "🦄",
      //   style: {
      //     borderRadius: "10px",
      //     background: "#333",
      //     color: "#fff",
      //   },
      // });
      return;
    }
    setIsLoading(true);

    try {
      const { blockhash, lastValidBlockHeight } =
        await SOLWalletConnection.getLatestBlockhash("confirmed");

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(solpublickey),
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solpublickey),
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
            from: solpublickey,
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
        senderAddress: solpublickey,
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

  const onSubmit = async (data: DepositFormData) => {
    try {
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

      const txData = await executeTransaction(data);

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
              description={`${amount} has been confirmed`}
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

      // Ensure queryClient is defined before calling invalidateQueries
      if (queryClient) {
        queryClient.invalidateQueries({
          queryKey: ["firstbalance"],
        });
      }
    } catch (error: unknown) {
      // This catch is mostly for unexpected errors
      console.error(error);
      // Toast error already handled by toast.promise
      reset();
    }
  };

  return (
    <div className="mb-6  ">
      <form
        className="flex items-end flex-wrap justify-between gap-8 lg:px-16 px-6 lg:py-[4rem] py-[2rem] "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" space-y-6 lg:w-[unset] w-full ">
          <label className="text-white text-[clamp(14px,1.8vw,20px)] font-bold leading-[clamp(20px,2vw,24.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
            Enter Total Amount
          </label>
          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              min: {
                value: 0.0000001,
                message: "Amount must be greater than 0",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className=" !text-[clamp(16px,2vw,22px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem]"
                type="number"
                min={0}
                step={0.000001}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || "")
                }
              />
            )}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div className="flex items-center md:flex-nowrap flex-wrap justify-end gap-6 ">
          <span className="text-white text-[clamp(18px,2vw,20px)] font-bold leading-[clamp(24px,2.4vw,24.76px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
            Total
          </span>
          <div className="flex items-center gap-6 ">
            <Image src={solImg} alt="" className=" mr-1 w-[32px] h-[25px]  " />
            {/* <span className="text-blue-400 mr-1">≈</span> */}
            <span className="text-white text-[clamp(28px,4vw,36px)] font-bold leading-[clamp(36px,4vw,44.57px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              {amount === 0 ? "0.0" : amount}
            </span>
          </div>
          <span className="text-[#CDD0E5] text-[24px] font-bold leading-[29.57px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
            /0
          </span>
        </div>

        <div className="flex  items-end flex-wrap gap-10 ">
          <div className="flex items-center flex-wrap gap-10 md:w-[unset] w-full ">
            <span className="text-white text-[20px] font-bold leading-[24.71px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
              Priority fee
            </span>
            <Input
              className=" !text-[clamp(16px,2vw,22px)] font-bold leading-[clamp(24px,2.4vw,29.71px)] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] h-[clamp(48px,6vw,64px)] max-w-[445px] w-full border-[#9999994D] bg-transparent rounded-[clamp(8px,2vw,17px)] text-white p-[1.2rem] "
              placeholder="0.0"
              type="number"
              min={0}
              step={"any"}
              defaultValue={0.00001}
            />
          </div>
          <Button
            className="bg-[#4CF37B] rounded-[12px] font-semibold text-[clamp(14px,2vw,16px)] leading-[100%] tracking-[0%] text-black h-[clamp(40px,5vw,55px)] w-[clamp(120px,10vw,147px)]"
            disabled={isLoading || isDepositing}
          >
            Deposit
            {isLoading || isDepositing ? (
              <CustomLoader size={"md"} variant={"dark"} />
            ) : (
              ""
            )}
          </Button>
        </div>
      </form>
      <div className="  bg-white rounded-[6px] p-[0.4rem] w-full h-full max-w-[87px] max-h-[87px]  ">
        <DepositQrCode amount={amount} />
      </div>
    </div>
  );
}

export default memo(DepositForm);
