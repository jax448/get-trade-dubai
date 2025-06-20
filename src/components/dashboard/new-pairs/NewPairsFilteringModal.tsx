"use client";
import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { DashBoardTableStore } from "@/store/NewPairTableStore";
import { Input } from "../../ui/input";
import { useForm } from "react-hook-form";

type FilterType =
  // | "token"
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "vol30m"
  | "vol1h"
  | "vol2h"
  | "vol4h"
  | "vol8h"
  | "vol24h"
  | "holders"
  | "price";

type FormValues = {
  min: number | null;
  max: number | null;
};

function NewPairsFilteringModal() {
  const setIsModalOpen = DashBoardTableStore((s) => s.setIsModalOpen);
  const isModalOpen = DashBoardTableStore((s) => s.isModalOpen);
  const selectedFilter = DashBoardTableStore(
    (s) => s.selectedFilter
  ) as FilterType;

  // new filtering logic

  const filteringStringObject = DashBoardTableStore(
    (s) => s.filteringStringObject
  );

  const setFilteringStringObject = DashBoardTableStore(
    (s) => s.setFilteringStringObject
  );

  const resetFilter = DashBoardTableStore((s) => s.resetFilter);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      min: null,
      max: null,
    },
  });

  const watchMin = watch("min");
  const watchMax = watch("max");

  useEffect(() => {
    if (isModalOpen) {
      const currentFilter = filteringStringObject[selectedFilter];
      setValue("min", currentFilter.min ? parseFloat(currentFilter.min) : null);
      setValue("max", currentFilter.max ? parseFloat(currentFilter.max) : null);
    }
  }, [isModalOpen, selectedFilter, filteringStringObject, setValue]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      setFilteringStringObject(selectedFilter, data.min, data.max);
      setIsModalOpen(false);
    },
    [selectedFilter, setFilteringStringObject, setIsModalOpen]
  );

  const validateAtLeastOneField = () => {
    return (
      (watchMin !== null && watchMin !== undefined) ||
      (watchMax !== null && watchMax !== undefined) ||
      "At least one field must be filled"
    );
  };

  const handleReset = useCallback(() => {
    reset({
      min: null,
      max: null,
    });
    resetFilter(selectedFilter);
  }, [reset, resetFilter, selectedFilter]);

  const getFilterDisplayName = () => {
    switch (selectedFilter) {
      // case "token":
      //   return "Token";
      case "dateTime":
        return "Age";
      case "liquidity":
        return "Liq";
      case "marketCap":
        return "Market Cap";
      case "vol30m":
        return "Vol";
      case "vol1h":
        return "Vol";
      case "vol2h":
        return "Vol";
      case "vol4h":
        return "Vol";
      case "vol8h":
        return "Vol";
      case "vol24h":
        return "Vol";
      case "holders":
        return "Holders";
      case "price":
        return "Price";
      default:
        return selectedFilter;
    }
  };

  // Get appropriate unit suffix based on filter type
  const getUnitSuffix = () => {
    switch (selectedFilter) {
      case "price":
        return "$";
      case "liquidity":
      case "marketCap":
        return "K";
      case "vol30m":
      case "vol1h":
      case "vol2h":
      case "vol4h":
      case "vol8h":
      case "vol24h":
        return "M";
      case "holders":
        return "";
      case "dateTime":
        return "m";
      default:
        return "";
    }
  };

  const unitSuffix = getUnitSuffix();
  const filterDisplayName = getFilterDisplayName();

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent
        aria-describedby="final chance modal"
        className="max-w-[812px] w-full rounded-lg bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)]  text-white   px-[4rem] py-[20px] border-none "
      >
        <DialogHeader className="relative">
          <h1 className=" border-b border-b-[#FFFFFF1A] md:pb-[2rem] pb-[1rem]  text-[#FEFEFF] font-bold text-[28px] leading-[40px] tracking-[-2%] text-center  ">
            Filter by {filterDisplayName}
          </h1>
        </DialogHeader>
        <DialogDescription>
          {/* {filterString && (
            <div className="mt-4 p-2 bg-[#F1F2FF0D] rounded border border-[#FFFFFF1A]">
              <p className="text-[#FFFFFFCC] text-sm">
                Current filter parameters: {filterString}
              </p>
            </div>
          )} */}
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid small:grid-cols-2 grid-cols-1 mt-8 gap-7">
            <div className="w-full space-y-2">
              <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] rounded-[2px] h-[clamp(30px,6vw,39px)] flex-grow w-full border-[#FFFFFF1A] border-[1px] bg-[#F1F2FF0D] focus-within:ring-1 focus-within:ring-[#FFFFFF80] focus-within:border-[#FFFFFF80]">
                <div className="w-full">
                  <Input
                    type="number"
                    placeholder={`Enter ${filterDisplayName}`}
                    className="border-none h-[41px] bg-transparent !font-bold !text-[14px] leading-[100%] tracking-[0%] focus-visible:ring-0 focus-visible:ring-offset-0 !rounded-[2px] !px-[1.6rem] text-[#FFFFFFCC]"
                    {...register("min", {
                      validate: {
                        atLeastOneField: validateAtLeastOneField,
                      },
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: `Min ${filterDisplayName} must be a positive number`,
                      },
                    })}
                    step={selectedFilter === "price" ? 0.0000000001 : 0.01}
                    min={0}
                  />
                  {errors.min && errors.min.type === "min" && (
                    <p className="text-red-500 text-sm font-semibold mt-1 ml-2">
                      {errors.min.message}
                    </p>
                  )}
                </div>
                {unitSuffix && (
                  <div className="flex border-[#FFFFFF1A] border-solid border-[1px] items-center justify-center w-[clamp(30px,6vw,55px)] h-[clamp(30px,6vw,41px)] rounded-[2px] bg-[#F1F2FF12]">
                    {unitSuffix}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] rounded-[2px] h-[clamp(30px,6vw,39px)] flex-grow w-full border-[#FFFFFF1A] border-[1px] bg-[#F1F2FF0D] focus-within:ring-1 focus-within:ring-[#FFFFFF80] focus-within:border-[#FFFFFF80]">
                <div className="w-full">
                  <Input
                    type="number"
                    placeholder={`Enter ${filterDisplayName}`}
                    className="border-none h-[41px] bg-transparent !font-bold !text-[14px] leading-[100%] tracking-[0%] focus-visible:ring-0 focus-visible:ring-offset-0 !rounded-[2px] !px-[1.6rem] text-[#FFFFFFCC]"
                    {...register("max", {
                      validate: {
                        atLeastOneField: validateAtLeastOneField,
                      },
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: `Max ${filterDisplayName} must be a positive number`,
                      },
                    })}
                    step={selectedFilter === "price" ? 0.0000000001 : 0.01}
                    min={0}
                  />
                  {errors.max && errors.max.type === "min" && (
                    <p className="text-red-500 text-sm font-semibold mt-1 ml-2">
                      {errors.max.message}
                    </p>
                  )}
                </div>

                {unitSuffix && (
                  <div className="flex border-[#FFFFFF1A] border-solid border-[1px] items-center justify-center w-[clamp(30px,6vw,55px)] h-[clamp(30px,6vw,41px)] rounded-[2px] bg-[#F1F2FF12]">
                    {unitSuffix}
                  </div>
                )}
              </div>
            </div>
          </div>

          {(errors.min?.type === "atLeastOneField" ||
            errors.max?.type === "atLeastOneField") && (
            <p className="text-red-500 text-sm font-semibold mt-4 text-center">
              At least one field must be filled
            </p>
          )}

          <div className="flex items-center gap-2 border-t border-t-[#FFFFFF1A] justify-end mt-[6rem] pt-[2rem]">
            <Button
              type="button"
              onClick={handleReset}
              className="w-[167px] h-[40px] rounded-[40px] px-[22px] py-[9px] font-bold text-[13px] leading-[100%] tracking-[0%] text-center font-gilroy flex items-center justify-center bg-transparent hover:bg-[#FFFFFF1A] border border-none "
            >
              <span>Reset</span>
            </Button>
            <Button
              type="submit"
              className="w-[167px] h-[40px] text-black rounded-[40px] px-[22px] py-[9px] font-bold text-[13px] leading-[100%] tracking-[0%] text-center font-gilroy flex items-center justify-center bg-[#FFFFFF] hover:opacity-80 hover:bg-[#FFFFFF]"
            >
              <span>Apply</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewPairsFilteringModal;
