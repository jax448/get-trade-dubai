import React, { memo, useCallback } from "react";
import { TableHead, TableHeader, TableRow } from "../../ui/table";

import sortingIcon from "@public/pics/SortingTableIcons.png";
import sortingUpIcon from "@public/pics/SortingUpTableIcon.png";
import sortingDownIcon from "@public/pics/SortingDonwTableIcon.png";
import Image from "next/image";
import FunnelImage from "@public/pics/FunnelFilterImg.png";
import { TrendingTableStore } from "@/store/TrendingTableStore";
import FilteringModal from "./TrendingFilteringModal";
import { X } from "lucide-react";
import { Button } from "../../ui/button";

type SortableField =
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "holders"
  | "price"
  // for volumes
  | "txvol1m"
  | "txvol5m"
  | "txvol1h"
  | "txvol6h"
  | "txvol24h"
  // Add more fields as needed
  | "percent1m"
  | "percent5m"
  | "percent1h"
  | "percent6h"
  | "percent24h"
  // percentage change on price I think
  | "priceChange1min"
  | "priceChange5min"
  | "priceChange1h"
  | "priceChange6h"
  | "priceChange24h";

type filterType =
  // | "token"
  | "dateTime"
  | "liquidity"
  | "marketCap"
  // for volumes
  | "txvol1m"
  | "txvol5m"
  | "txvol1h"
  | "txvol6h"
  | "txvol24h"
  // for percentage change
  | "priceChange1min"
  | "priceChange5min"
  | "priceChange1h"
  | "priceChange6h"
  | "priceChange24h"
  | "transactions24h"
  | "holders"
  | "price";

function TrendingTableHeader({
  toggleSort,
  sortField,
  sortDirection,
}: {
  toggleSort: (field: SortableField) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc" | "none";
}) {
  //
  // Function to handle filter button click
  // This function is called when the filter button is clicked
  // It prevents the default behavior of the button and shows an alert with the field name

  const setIsModalOpen = TrendingTableStore((s) => s.setIsModalOpen);
  const setSelectedFilter = TrendingTableStore((s) => s.setSelectedFilter);

  const filteringStringObject = TrendingTableStore(
    (s) => s.filteringStringObject
  );

  const resetFilter = TrendingTableStore((s) => s.resetFilter);

  const handleFilterClick = (field: filterType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the sort when clicking filter
    // setFilterString(field);
    setIsModalOpen(true);
    setSelectedFilter(field); // Set the selected filter in the store
  };

  const handleRemoveFilter = (field: filterType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the sort when clicking filter
    resetFilter(field); // Use the resetFilter function from the store
  };

  const isFilterActive = useCallback(
    (filterType: filterType): boolean => {
      const filterValues = filteringStringObject[filterType];
      return filterValues.min !== null || filterValues.max !== null;
    },
    [filteringStringObject]
  );

  const volumes = [
    { name: "Vol 1m", value: "txvol1m" },
    { name: "Vol 5m", value: "txvol5m" },
    { name: "Vol 1h", value: "txvol1h" },
    { name: "Vol 6h", value: "txvol6h" },
    { name: "Vol 24h", value: "txvol24h" },
  ];

  const pricePercentages = [
    { name: "1m%", value: "priceChange1min" },
    { name: "5m%", value: "priceChange5min" },
    { name: "1h%", value: "priceChange1h" },
    { name: "6h%", value: "priceChange6h" },
    { name: "24h%", value: "priceChange24h" },
  ];

  return (
    <>
      <TableHeader className="bg-[#1d1d23] sticky top-0 z-[5] border-b-[#FFFFFF1A]    ">
        <TableRow
          className={`
            font-medium 
            text-[clamp(10px,1.4vw,14px)] 
            leading-[clamp(14px,1.6vw,16.05px)] 
            tracking-[-2%] 
            h-[clamp(40px,6vw,50px)] 
            hover:bg-transparent 
            border-b-[#FFFFFF1A] 
            border-b-[0.5px] 
            text-[#9B9B9B]
            text-nowrap
          `}
        >
          <TableHead className=" text-center sticky-col first-col "></TableHead>
          <TableHead className=" text-center  ">
            <div className="flex items-center justify-start pl-4 gap-2 ">
              <span>Token</span>
              {/* <button className="relative" onClick={(e) => handleFilterClick("token", e)}>
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="ml-2 min-w-[12px] "
                />
              </button> */}
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none  ">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("dateTime")}
              >
                <span>Age</span>
                {sortField === "dateTime" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>

              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("dateTime")
                    ? handleRemoveFilter("dateTime", e)
                    : handleFilterClick("dateTime", e)
                }
              >
                {isFilterActive("dateTime") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("liquidity")}
              >
                Liq{" "}
                {sortField === "liquidity" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("liquidity")
                    ? handleRemoveFilter("liquidity", e)
                    : handleFilterClick("liquidity", e)
                }
              >
                {isFilterActive("liquidity") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("marketCap")}
              >
                MC{" "}
                {sortField === "marketCap" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("marketCap")
                    ? handleRemoveFilter("marketCap", e)
                    : handleFilterClick("marketCap", e)
                }
              >
                {isFilterActive("marketCap") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          {/* all volumes and dataRate: percentage values */}
          {volumes.map((i, idx) => {
            return (
              <TableHead
                key={idx}
                className="text-center cursor-pointer select-none"
              >
                <div className="flex items-center justify-center gap-2 ">
                  <button
                    className="flex items-center justify-center gap-2 "
                    onClick={() => toggleSort(i.value as SortableField)}
                  >
                    {i.name}{" "}
                    {sortField === i.value ? (
                      sortDirection === "none" ? (
                        <Image
                          src={sortingIcon}
                          alt="No sorting"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      ) : sortDirection === "asc" ? (
                        <Image
                          src={sortingUpIcon}
                          alt="Sort ascending"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      ) : (
                        <Image
                          src={sortingDownIcon}
                          alt="Sort descending"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      )
                    ) : (
                      <Image
                        src={sortingIcon}
                        alt="No sorting"
                        className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                      />
                    )}
                  </button>
                  <button
                    className="relative"
                    onClick={(e) =>
                      isFilterActive(i.value as filterType)
                        ? handleRemoveFilter(i.value as filterType, e)
                        : handleFilterClick(i.value as filterType, e)
                    }
                  >
                    {isFilterActive(i.value as filterType) && (
                      <Button
                        className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                        type="button"
                      >
                        <X className=" text-red-500" />
                      </Button>
                    )}

                    <Image
                      src={FunnelImage}
                      alt="Filter"
                      className="min-w-[clamp(10px,2vw,12px)]"
                    />
                  </button>
                </div>
              </TableHead>
            );
          })}

          {pricePercentages.map((i, idx) => {
            return (
              <TableHead
                key={idx}
                className="text-center cursor-pointer select-none"
              >
                <div className="flex items-center justify-center gap-2 ">
                  <button
                    className="flex items-center justify-center gap-2 "
                    onClick={() => toggleSort(i.value as SortableField)}
                  >
                    {i.name}{" "}
                    {sortField === i.value ? (
                      sortDirection === "none" ? (
                        <Image
                          src={sortingIcon}
                          alt="No sorting"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      ) : sortDirection === "asc" ? (
                        <Image
                          src={sortingUpIcon}
                          alt="Sort ascending"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      ) : (
                        <Image
                          src={sortingDownIcon}
                          alt="Sort descending"
                          className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                        />
                      )
                    ) : (
                      <Image
                        src={sortingIcon}
                        alt="No sorting"
                        className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                      />
                    )}
                  </button>
                  <button
                    className="relative"
                    onClick={(e) =>
                      isFilterActive(i.value as filterType)
                        ? handleRemoveFilter(i.value as filterType, e)
                        : handleFilterClick(i.value as filterType, e)
                    }
                  >
                    {isFilterActive(i.value as filterType) && (
                      <Button
                        className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                        type="button"
                      >
                        <X className=" text-red-500" />
                      </Button>
                    )}

                    <Image
                      src={FunnelImage}
                      alt="Filter"
                      className="min-w-[clamp(10px,2vw,12px)]"
                    />
                  </button>
                </div>
              </TableHead>
            );
          })}

          {/* all volumes and dataRate: percentage values */}

          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2">
              <button
                className="flex items-center justify-center gap-2"
                onClick={() => toggleSort(`transactions24h` as SortableField)}
              >
                TXs 24h
                {sortField === (`transactions24h` as SortableField) ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive(`transactions24h` as filterType)
                    ? handleRemoveFilter(`transactions24h` as filterType, e)
                    : handleFilterClick(`transactions24h` as filterType, e)
                }
              >
                {isFilterActive(`transactions24h` as filterType) && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          {/*
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2">
              <button
                className="flex items-center justify-center gap-2"
                onClick={() =>
                  toggleSort(`percent${shortInterval}` as SortableField)
                }
              >
                Vol {shortInterval}
                {sortField === (`percent${shortInterval}` as SortableField) ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive(`vol${shortInterval}` as filterType)
                    ? handleRemoveFilter(`vol${shortInterval}` as filterType, e)
                    : handleFilterClick(`vol${shortInterval}` as filterType, e)
                }
              >
                {isFilterActive(`vol${shortInterval}` as filterType) && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead> */}

          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("holders")}
              >
                Holders{" "}
                {sortField === "holders" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("holders")
                    ? handleRemoveFilter("holders", e)
                    : handleFilterClick("holders", e)
                }
              >
                {isFilterActive("holders") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("price")}
              >
                Price{" "}
                {sortField === "price" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("price")
                    ? handleRemoveFilter("price", e)
                    : handleFilterClick("price", e)
                }
              >
                {isFilterActive("price") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          {/* skdjfksdhfksdh */}
          {/* update the portfolio logic and design */}
          <TableHead className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("price")}
              >
                Portfolio{" "}
                {/* {sortField === "price" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )} */}
              </button>
              {/* <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("price")
                    ? handleRemoveFilter("price", e)
                    : handleFilterClick("price", e)
                }
              >
                {isFilterActive("price") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button> */}
            </div>{" "}
          </TableHead>
          {/* update the portfolio logic and design */}

          <TableHead className="w-[clamp(80px,10vw,120px)] text-center  end-col sticky-col  ">
            Buy<span className=" xl:inline-block hidden  ">/Sell</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <FilteringModal />
    </>
  );
}

export default memo(TrendingTableHeader);
