"use client";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  backgroundVariants,
  iconVariants,
  textVariants,
} from "@/constants/FramerMotionVariations";
import { cn } from "@/lib/utils";
import QuickBuyIcon from "@public/pics/QuickBuyIcon.png";
import CrossQuickBuyIcon from "@public/pics/CrossQuickBuyIcon.png";
import { useQuickBuyStore } from "@/store/QuickBuy";
import { useSolanaAuthStore } from "@/store/auth";

// Memoized version of QuickBuyButton
export const QuickBuyButton = memo(function QuickBuyButton() {
  const MotionButton = motion(Button);
  const MotionImage = motion(Image);
  const MotionSpan = motion(motion.span);

  // Using Zustand selectors to prevent unnecessary rerenders
  const quickBuy = useQuickBuyStore((state) => state.isQuickBuyEnabled);
  const handleQuickBuy = useQuickBuyStore((state) => state.toggleQuickBuy);

  const key = useSolanaAuthStore((state) => state.key);
  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);

  const handleQuickBuyWithKey = useMemo(() => {
    return key ? handleQuickBuy : OpenModalFunc;
  }, [key, handleQuickBuy, OpenModalFunc]);

  // Using useMemo for elements that depend on state
  const buttonVariants = useMemo(() => {
    return quickBuy && key ? "active" : "inactive";
  }, [quickBuy, key]);

  return (
    <MotionButton
      aria-label="quick buy"
      name="quick buy"
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={buttonVariants}
      variants={backgroundVariants}
      className={cn(
        "bg-[#4CF37B] text-black font-[600] transition-all duration-200 ease-linear",
        // Font size & spacing with clamp for responsive
        "text-[clamp(12px,2.5vw,14px)]",
        "leading-[1]",
        "tracking-[0]",

        // Height and width
        "h-[clamp(30px,6vw,39px)]",
        "max-w-[clamp(100px,20vw,127px)]",
        "w-full",

        // Padding
        "px-[clamp(15px,3vw,25px)]",
        "py-[clamp(8px,2vw,12px)]",

        // Border radius and layout
        "rounded-[6px] flex items-center",
        "gap-[clamp(4px,2vw,8px)]",
        "hover:bg-emerald-600"
      )}
      onClick={handleQuickBuyWithKey}
    >
      <AnimatePresence mode="wait">
        {quickBuy && key ? (
          <>
            <MotionImage
              alt="sol icon"
              className="h-[20px] w-[20px]  min-w-[20px]"
              src={CrossQuickBuyIcon}
              key="quickBuyIconInactive"
              height={20}
              width={20}
              variants={iconVariants}
              initial="enter"
              animate="center"
              exit="exit"
              layout
            />
            <MotionSpan
              className="hidden md:block"
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              layout
            >
              Linked Buy
            </MotionSpan>
          </>
        ) : (
          <>
            <MotionImage
              alt="sol icon"
              className="h-[20px] w-[20px] min-w-[20px] "
              src={QuickBuyIcon}
              key="quickBuyIconActive"
              height={20}
              width={20}
              variants={iconVariants}
              initial="enter"
              animate="center"
              exit="exit"
              layout
            />
            <MotionSpan
              className="hidden md:block"
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              layout
            >
              Quick Buy
            </MotionSpan>
          </>
        )}
      </AnimatePresence>
    </MotionButton>
  );
});
