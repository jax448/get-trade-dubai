"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sliders from "@public/pics/FilterSLidersIcon.png";
import ArrowDown from "@public/pics/arrow-down.png";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";

// import seattings from "@public/pics/settings-2.png";

export interface WalletHoldings {
  balance: number;
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
}

interface FilterComponentProps {
  data: WalletHoldings[];
  onFilteredDataChange: (filteredData: WalletHoldings[]) => void;
}

interface FilterFormValues {
  hideLowLiq: boolean;
  hideHoneypot: boolean;
  hideSmallAsset: boolean;
  hideSellOut: boolean;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  data,
  onFilteredDataChange,
}) => {
  // Use refs to prevent re-renders
  const searchTermRef = useRef("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // This will prevent unnecessary re-renders from watch()
  const formRef = useRef({
    hideLowLiq: false,
    hideHoneypot: false,
    hideSmallAsset: false,
    hideSellOut: false,
  });

  const { control, reset } = useForm<FilterFormValues>({
    defaultValues: formRef.current,
  });

  // Apply filters without causing renders
  const applyAllFilters = () => {
    if (!data || data.length === 0) return [];

    let filteredData = [...data];
    const searchTerm = searchTermRef.current;
    const formValues = formRef.current;

    // Apply search filter
    if (searchTerm && searchTerm.trim() !== "") {
      filteredData = filteredData.filter(
        (item) =>
          (item.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (item.symbol?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (item.address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    // Apply checkbox filters
    if (formValues.hideSmallAsset) {
      filteredData = filteredData.filter((item) => (item.balance || 0) > 0.001);
    }

    if (formValues.hideLowLiq) {
      // Placeholder logic - replace with actual liquidity check
      filteredData = filteredData.filter((_, index) => index % 3 !== 0);
    }

    if (formValues.hideHoneypot) {
      // Placeholder logic - replace with actual honeypot check
      filteredData = filteredData.filter((_, index) => index % 5 !== 0);
    }

    if (formValues.hideSellOut) {
      // Placeholder logic - replace with actual sell-out check
      filteredData = filteredData.filter((_, index) => index % 4 !== 0);
    }

    return filteredData;
  };

  // Use a timeout to prevent rapid consecutive updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredData = applyAllFilters();
      onFilteredDataChange(filteredData);
    }, 100);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchTermRef.current = e.target.value;
    // Trigger filter application with a timeout
    setTimeout(() => {
      const filteredData = applyAllFilters();
      onFilteredDataChange(filteredData);
    }, 300);
  };

  const onCheckboxChange = (name: keyof FilterFormValues, value: boolean) => {
    formRef.current[name] = value;
    // Don't update filteredData here - wait for Apply button
  };

  const resetFilters = () => {
    reset();
    formRef.current = {
      hideLowLiq: false,
      hideHoneypot: false,
      hideSmallAsset: false,
      hideSellOut: false,
    };
    setTimeout(() => {
      const filteredData = applyAllFilters();
      onFilteredDataChange(filteredData);
    }, 100);
  };

  const handleApplyFilters = () => {
    setDropdownOpen(false);
    const filteredData = applyAllFilters();
    onFilteredDataChange(filteredData);
  };

  return (
    <div className="flex items-center justify-end space-x-[clamp(0.5rem,3vw,1rem)] w-full">
      {/* Search component */}
      <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] bg-zinc-800 rounded-lg px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,39px)] flex-grow max-w-[clamp(300px,50vw,443px)]">
        <Search className="text-white w-[clamp(16px,3vw,18px)] h-[clamp(16px,3vw,18px)]" />
        <Input
          placeholder="Search token or address"
          className="bg-transparent h-[clamp(30px,6vw,39px)] max-w-[clamp(300px,50vw,443px)] w-full !font-normal !text-[clamp(12px,2.5vw,14px)] !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#B6B6B6] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-zinc-500"
          defaultValue={searchTermRef.current}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center space-x-[clamp(6px,2vw,12px)]">
        {/* Filter dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className=" h-[clamp(32px,5vw,37px)]
          max-w-[clamp(80px,26vw,101px)]
          bg-[#FFFFFF1A]
          rounded-[6px]
          px-[clamp(12px,4vw,20px)]
          flex items-center justify-center
          gap-[clamp(4px,1vw,8px)]
          text-white
          font-normal
          text-[clamp(10px,3vw,12px)]
          leading-[100%]
          tracking-[0%]"
              type="button"
            >
              <Image
                src={Sliders}
                alt="Filter"
                className="w-[clamp(14px,3.5vw,16.36px)] h-[clamp(14px,3.5vw,16.36px)]"
              />
              Filter
              <Image
                src={ArrowDown}
                alt="Arrow"
                className="w-[clamp(10px,2.5vw,11.45px)] h-[clamp(10px,2.5vw,11.45px)]"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[300px] bg-[#28282B] rounded-lg p-10 border border-transparent [box-shadow:0px_-1px_4px_0px_rgba(127,_127,_127,_0.25)_inset]"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilters();
              }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="hideLowLiq"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="hideLowLiq"
                        className=" w-[24px] h-[24px] border-white rounded-[6px] "
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          onCheckboxChange("hideLowLiq", checked === true);
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor="hideLowLiq"
                    className="text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                  >
                    Hide Low Liq
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="hideHoneypot"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="hideHoneypot"
                        checked={field.value}
                        className=" w-[24px] h-[24px] border-white rounded-[6px] "
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          onCheckboxChange("hideHoneypot", checked === true);
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor="hideHoneypot"
                    className="text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                  >
                    Hide Honeypot
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="hideSmallAsset"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="hideSmallAsset"
                        checked={field.value}
                        className=" w-[24px] h-[24px] border-white rounded-[6px] "
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          onCheckboxChange("hideSmallAsset", checked === true);
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor="hideSmallAsset"
                    className="text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                  >
                    Hide Small Asset
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name="hideSellOut"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="hideSellOut"
                        checked={field.value}
                        className=" w-[24px] h-[24px] border-white rounded-[6px] "
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          onCheckboxChange("hideSellOut", checked === true);
                        }}
                      />
                    )}
                  />
                  <label
                    htmlFor="hideSellOut"
                    className="text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer"
                  >
                    Hide Sell Out
                  </label>
                </div>

                <div className="border-t border-zinc-700 my-4"></div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-white w-[92px] h-[32px] rounded-[43px] font-bold text-[13px] leading-[100%] tracking-[0%] text-center hover:bg-zinc-800 hover:text-white "
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="bg-white  w-[92px] h-[32px] rounded-[43px] font-bold text-[13px] leading-[100%] tracking-[0%] text-center text-black hover:bg-white/90"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <button className="text-gray-500 hover:text-gray-700">
          <div className="w-[clamp(20px,4vw,24px)] h-[clamp(20px,4vw,24px)] relative">
            <Image
              src={seattings}
              alt="Settings"
              fill
              sizes="(max-width: 768px) 24px, 24px"
              className="object-contain"
            />
          </div>
        </button> */}
      </div>
    </div>
  );
};

export default FilterComponent;
