"use client";
import { AccountsService } from "@/api-lib/services/AccountsService";
import { useSolanaAuthStore } from "@/store/auth";
import React, { useState } from "react";
import Component1 from "./Component1";
import Component2 from "./Component2";
// import Component3 from "./Component3";
import { useRouter } from "next/navigation";
import QRCodeComponent3 from "./QRCodeCoponent";

function Page() {
  const router = useRouter();
  const [steps, setSteps] = useState(1); // Manage current step (1 to 3)

  const [isLoading, setIsLoading] = useState(false);

  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const soladdress = useSolanaAuthStore().solpublicKey;
  const getTradePublicKey = useSolanaAuthStore().getTradePublicKey;
  const setStep2DataFunc = useSolanaAuthStore().setStep2DataFunc;
  const removeStep2Data = useSolanaAuthStore().removeStep2Data;
  const key = useSolanaAuthStore().key;
  // const isfirstTimeLogin = useSolanaAuthStore().isfirstTimeLogin;

  // useEffect(() => {
  //   if (!isfirstTimeLogin) {
  //     router.push("/");
  //     return;
  //   }
  //   return;
  // }, [isfirstTimeLogin, router]);

  // useEffect(() => {
  //   if (isfirstTimeLogin) {
  //     window.addEventListener("beforeunload", (event) => {
  //       event.preventDefault();
  //       event.returnValue = ""; // This is required for Chrome to show the confirmation dialog
  //     });
  //   }
  //   return () => {
  //     window.removeEventListener("beforeunload", (event) => {
  //       event.preventDefault();
  //       event.returnValue = ""; // This is required for Chrome to show the confirmation dialog
  //     });
  //   };
  // }, [isfirstTimeLogin, steps]);

  const handlGenerateWallet = async () => {
    setIsLoading(true);
    await AccountsService.generateWallet(soladdress || "")
      .then((res) => {
        console.log("res in generate wallet", res);
        setPrivateKey(res.data.privateKey);
        setStep2DataFunc(res.data.walletAddress, res.data.apiKey);
      })
      .catch((err) => {
        console.log("err in generate wallet", err);
        router.push("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="  !text-white xl:px-6 px-2 my-[3rem]  ">
      <div
        style={{ maxWidth: "clamp(1200px,95vw,1450px)" }}
        className=" mx-auto grid xl:grid-cols-3 sm:grid-cols-2  gap-6  p-4 text-white relative h-full     "
      >
        <Component1
          isLoading={isLoading}
          handleGenerate={handlGenerateWallet}
          solpublicKey={soladdress || ""}
        />

        <Component2
          MaxTradingWallet={getTradePublicKey || ""}
          MaxworthPrivateKey={privateKey || ""}
          setPrivateKey={setPrivateKey}
          setSteps={setSteps}
          removeStep2Data={removeStep2Data}
          steps={steps}
        />

        <QRCodeComponent3
          key={key || ""}
          MaxTradingWallet={getTradePublicKey || ""}
          removeStep2Data={removeStep2Data}
          steps={steps}
        />

        {/* <Component3
          key={key || ""}
          MaxTradingWallet={getTradePublicKey || ""}
          MaxworthPrivateKey={setStep2Data.privateKey || ""}
          steps={steps}
        /> */}
      </div>
    </div>
  );
}

export default Page;
