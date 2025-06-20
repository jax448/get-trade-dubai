import { useAlertsMutate } from "@/api-lib/api-hooks/useWatchListApiHook";
import CustomToast from "@/components/CustomToast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/Context/React-Query-Provider";
import { useSolanaAuthStore } from "@/store/auth";
import Image from "next/image";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import plusAlert from "@public/pics/PlusAddAlertIcon.png";
import { useForm } from "react-hook-form";
import { CustomLoader } from "@/components/loader";

type FormValues = {
  price: number | null;
  liquidity: number | null;
};

function AlertsDialog({
  isAlertOpen,
  ToggleAlertModal,
  tokenAddress,
}: {
  isAlertOpen: boolean;
  ToggleAlertModal: () => void;
  tokenAddress: string;
}) {
  const key = useSolanaAuthStore((state) => state.key);
  const { mutateAsync: AlertsMutateAsync, isPending } = useAlertsMutate(
    key || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      price: null,
      liquidity: null,
    },
  });

  const watchPrice = watch("price");
  const watchLiquidity = watch("liquidity");

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (!key) {
        toast.custom((t) => (
          <CustomToast
            type="error"
            title={"Please login to add to watchlist"}
            description=""
            t={t}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        return;
      }

      // Filter out null values
      const alertData = {
        price: data.price || 0,
        liquidity: data.liquidity || 0,
        tokenAddress,
      };

      AlertsMutateAsync(alertData, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
          reset();
          toast.custom((t) => {
            return (
              <CustomToast
                type="success"
                title="Alerts updated"
                description="Alerts updated successfully"
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            );
          });

          // Close modal after success
          ToggleAlertModal();
        },
        onError(error) {
          console.log("Error");
          toast.custom((t) => {
            return (
              <CustomToast
                type="error"
                title={error.message}
                description=""
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            );
          });
        },
      });
    },
    [AlertsMutateAsync, key, tokenAddress, ToggleAlertModal, reset]
  );

  // Custom validation function to ensure at least one field is filled
  const validateAtLeastOneField = () => {
    return (
      (watchPrice !== null && watchPrice !== undefined) ||
      (watchLiquidity !== null && watchLiquidity !== undefined) ||
      "At least one field must be filled"
    );
  };

  return (
    <Dialog open={isAlertOpen} onOpenChange={ToggleAlertModal}>
      <DialogContent className="max-w-[800px] w-full bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)] border border-[#161936] text-white py-[4rem] !rounded-[18px]">
        <DialogHeader className="relative">
          <h1 className="border-b border-b-[#FFFFFF1A] md:pb-[2rem] pb-[1rem] text-[#FEFEFF] font-bold text-[28px] leading-[40px] tracking-[-2%] text-center">
            Alerts
          </h1>
        </DialogHeader>
        <DialogDescription className="px-[1rem]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid small:grid-cols-2 grid-cols-1  gap-7">
              <div className="w-full space-y-8">
                <label className="font-bold text-[16px] leading-[0px] tracking-[0%] text-center align-bottom text-[#FEFEFF]">
                  Price
                </label>
                <div>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    className="border-[#FFFFFF1A] h-[41px] bg-[#F1F2FF0D] !font-bold !text-[14px] leading-[100%] tracking-[0%] focus-visible:ring-0 focus-visible:ring-offset-0 !rounded-[2px] !px-[1.6rem] text-[#FFFFFFCC] "
                    {...register("price", {
                      validate: {
                        atLeastOneField: validateAtLeastOneField,
                      },
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price must be a positive number",
                      },
                    })}
                    step={0.0000000001}
                    min={0}
                    max={1000000000000000000000}
                  />
                  {errors.price && errors.price.type === "min" && (
                    <p className="text-red-500 text-xl font-semibold mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full space-y-8">
                <label className="font-bold text-[16px] leading-[0px] tracking-[0%] text-center align-bottom text-[#FEFEFF]">
                  Liquidity
                </label>
                <div>
                  <Input
                    type="number"
                    placeholder="Enter liquidity"
                    className="border-[#FFFFFF1A] h-[41px] bg-[#F1F2FF0D] !font-bold !text-[14px] leading-[100%] tracking-[0%] focus-visible:ring-0 focus-visible:ring-offset-0 !rounded-[2px] !px-[1.6rem] text-[#FFFFFFCC]"
                    {...register("liquidity", {
                      validate: {
                        atLeastOneField: validateAtLeastOneField,
                      },
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Liquidity must be a positive number",
                      },
                    })}
                    step={0.0000000001}
                    min={0}
                    max={100000000000000000000000000}
                  />
                  {errors.liquidity && errors.liquidity.type === "min" && (
                    <p className="text-red-500 text-xl font-semibold mt-1">
                      {errors.liquidity.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {(errors.price?.type === "atLeastOneField" ||
              errors.liquidity?.type === "atLeastOneField") && (
              <p className="text-red-500 text-xl font-semibold mt-4 text-center">
                At least one field must be filled
              </p>
            )}

            <div className="flex items-center justify-center pt-[4rem]">
              <Button
                type="submit"
                className="w-[167px] h-[40px] rounded-[40px] px-[22px] py-[9px] font-medium text-[14.59px] leading-[100%] tracking-[0%] flex items-center justify-center bg-[#DC1FFF] hover:opacity-80 hover:bg-[#DC1FFF]"
                disabled={isPending}
              >
                {isPending ? (
                  <CustomLoader size={"md"} variant={"light"} />
                ) : (
                  <Image src={plusAlert} alt="" className="w-[18px] h-[18px]" />
                )}
                <span>Create Alerts</span>
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default AlertsDialog;
