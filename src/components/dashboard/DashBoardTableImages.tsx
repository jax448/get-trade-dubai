import React, { useCallback, memo, useMemo } from "react";
import Image from "next/image";
import Export from "@public/pics/ExportTableIcon.png";
import { useWatchListMutate } from "@/api-lib/api-hooks/useWatchListApiHook";
import { useSolanaAuthStore } from "@/store/auth";
import { queryClient } from "@/Context/React-Query-Provider";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";

import FillStar from "@public/pics/starTableIcon.png";
import yellowFillStar from "@public/pics/yellowFillStarsImage.png";
import { useShareModal } from "@/store/ShareModal";
import { Button } from "../ui/button";

interface DashBoardTableImagesProps {
  tokenAddress: string;
  favourite: boolean; // New prop to determine star state
}

const DashBoardTableImages = memo(
  ({ tokenAddress, favourite }: DashBoardTableImagesProps) => {
    const key = useSolanaAuthStore((state) => state.key);
    const { mutate } = useWatchListMutate(key || "");
    const toggleShareModal = useShareModal((state) => state.toggleShareModal);
    const setShareData = useShareModal((state) => state.setShareData);

    const HandleToken = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        // Set the specific token data before opening the modal
        setShareData({
          text: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
          title: "Check out this token!",
          url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
          description: `Explore this  token on GetTrade.Token: ${tokenAddress}`,
        });
        toggleShareModal();
      },
      [toggleShareModal, setShareData, tokenAddress]
    );

    const imageClass =
      "w-[clamp(14px,2vw,22px)] min-w-[clamp(14px,2vw,22px)] h-[clamp(14px,2vw,22px)]";

    const starImage = useMemo(() => {
      return favourite ? yellowFillStar : FillStar;
    }, [favourite]);

    // Memoize the export image
    const exportImage = useMemo(() => {
      return Export;
    }, []);

    const handleWatchList = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
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
        mutate(tokenAddress, {
          onSuccess: (data) => {
            toast.custom((t) => (
              <CustomToast
                type={
                  data.data === "Token added to watchlist" ? "success" : "error"
                }
                title="Watchlist updated"
                description={data.data}
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            ));
            queryClient.invalidateQueries({ queryKey: ["GetTokenInfo"] });
            queryClient.invalidateQueries({
              queryKey: ["publicTokenData"],
              stale: true,
            });
            queryClient.invalidateQueries({ queryKey: ["WatchList"] });
          },
          onError: (error) => {
            toast.custom((t) => (
              <CustomToast
                type="error"
                title={error.message || "Error updating watchlist"}
                description=""
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            ));
          },
        });
      },
      [mutate, tokenAddress, key]
    );

    // Memoize the entire button and image elements
    const memoizedImages = useMemo(() => {
      return (
        <>
          <Button
            onClick={handleWatchList}
            aria-label={
              favourite ? "Remove from watchlist" : "Add to watchlist"
            }
            className={`"flex items-center justify-center h-[unset] bg-transparent !p-[2px] "   `}
          >
            <Image
              src={starImage}
              alt={favourite ? "Remove from watchlist" : "Add to watchlist"}
              width={20}
              height={20}
              className={imageClass + "  "}
              loading="eager"
              unoptimized
            />
            {/* <span className={`block md:hidden   `}>
              {favourite ? " remove " : "Save"}
            </span> */}
          </Button>
          <Button
            onClick={HandleToken}
            aria-label="Share Token"
            className=" bg-transparent h-[unset] !p-[2px] "
          >
            <Image
              src={exportImage}
              alt="Export"
              width={20}
              height={20}
              className={imageClass + "  "}
              loading="eager"
              unoptimized
            />
          </Button>
        </>
      );
    }, [
      starImage,
      exportImage,
      handleWatchList,
      HandleToken,
      imageClass,
      favourite,
    ]);

    return memoizedImages;
  }
);

// Display name for debugging
DashBoardTableImages.displayName = "DashBoardTableImages";

export default DashBoardTableImages;
