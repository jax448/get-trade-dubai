import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import emptyWallet from "@public/pics/Generate-wallet-Icon.svg";
import ClipboardCopy from "@/components/ClipBoardCopy";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function Component2({
  MaxTradingWallet,
  MaxworthPrivateKey,
  setPrivateKey,
  removeStep2Data,
  setSteps,
  steps,
}: {
  MaxTradingWallet: string;
  MaxworthPrivateKey: string;
  setPrivateKey: (privateKey: string) => void;
  setSteps: (steps: number) => void;
  removeStep2Data: () => void;
  steps: number;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  return (
    <div
      className={`  h-full relative z-10 flex flex-col items-center justify-between w-full mx-auto mt-8 max-w-[474px] xl:p-[4rem] py-[2rem] sm:px-[1rem] px-[2rem] rounded-[16px] bg-[#FFFFFF1A] [box-shadow:inset_0_-1px_4px_0px_#7F7F7F40]  ${
        (steps <= 1 && !MaxTradingWallet) || !MaxworthPrivateKey
          ? " opacity-40 cursor-not-allowed "
          : ""
      }  `}
    >
      <div className="flex flex-col items-center justify-between">
        <div className="mb-12">
          <div className="md:w-[67px] md:h-[67px] w-[44px] h-[44px] relative flex items-center justify-center">
            <Image src={emptyWallet} alt="" fill />
          </div>
        </div>
        <h1 className="font-normal text-[clamp(1.2rem,1.492vw+0.723rem,2.513rem)] leading-[clamp(1.6rem,1.023vw+1.273rem,2.5rem)] tracking-[0%] text-center mb-2 text-white ">
          This is your
        </h1>
        <h2 className="font-semibold text-[clamp(1.6rem,2.59vw+0.771rem,3.879rem)] leading-[clamp(2.2rem,8.864vw+_-0.636rem,10rem)] tracking-[-2%] text-center ">
          Trading wallet
        </h2>
        <div className=" mt-[2.5rem] space-y-[3.2rem] ">
          <div className="space-y-[1.2rem]">
            <p className="font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)] tracking-[0%] text-[white]">
              GeT. Trading wallet
            </p>
            <ClipboardCopy content={MaxTradingWallet} />
          </div>
          <div className="space-y-[1.2rem]">
            <p className="font-semibold text-[clamp(1.2rem,0.682vw+0.982rem,1.8rem)] leading-[clamp(1.5rem,0.341vw+1.391rem,1.8rem)] tracking-[0%] text-[white]">
              PRIVATE KEY
            </p>
            <p className="font-gilroy font-medium text-[clamp(1rem,0.455vw+0.855rem,1.44rem)] leading-[clamp(1.2rem,0.227vw+1.127rem,1.4rem)] tracking-[0%] text-[#CDD0E5]">
              Please copy the blow private key and store it in a safe location.
              Your Private key will NOT be displayed again.
            </p>
          </div>
          <PrivateKeySlider
            setCompleted={setCompleted}
            completed={completed}
            privateKey={MaxworthPrivateKey}
          />
        </div>
      </div>
      <div className="w-full flex justify-center mt-8   ">
        <Button
          className={cn(
            " w-[clamp(21rem,11.364vw+17.364rem,31rem)] h-[clamp(4rem,1.25vw+3.6rem,5.1rem)] hover:bg-[#4cf37bcb]  bg-[#4CF37B] px-[20px] rounded-[39px] text-[clamp(1.4rem,0.909vw+1.109rem,2.2rem)] text-center text-[#000000] disabled:opacity-60 disabled:cursor-not-allowed  font-bold leading-[38.74px] ",
            !completed ? "bg-black text-white" : "  "
          )}
          onClick={() => {
            setOpenModel(true);
          }}
          disabled={!completed ? true : false}
        >
          Continue
        </Button>
      </div>
      <Dialog open={openModel} onOpenChange={() => setOpenModel(false)}>
        <DialogContent
          aria-describedby="final chance modal"
          className="max-w-[676px] w-full rounded-lg bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)]  text-white md:px-[100px] sm:px-[2rem] px-[1rem] py-[56px] border-none "
        >
          <DialogHeader className="relative">
            <DialogTitle className="text-[clamp(1.8rem,0.633vw+1.597rem,2.8rem)] font-bold leading-[34.66px] text-center [text-underline-position:from-font] [text-decoration-skip-ink:none]  ">
              Final CHANCE TO Save PRIVATE KEY
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>

          <div>
            <p className="text-[clamp(1.5rem,0.57vw+1.318rem,2.4rem)] font-semibold leading-[clamp(2.1rem,0.506vw+1.938rem,2.9rem)] text-center [text-underline-position:from-font] [text-decoration-skip-ink:none] text-[#CDD0E5] mt-[-8px]   ">
              You will not be able to retrieve it again.
            </p>
            <div className=" flex items-center md:mt-16 mt-8 justify-center flex-wrap sm:gap-2 gap-6 mx-auto  ">
              <Button
                className=" text-[#777777]   w-[clamp(17rem,1.899vw+16.392rem,20rem)] h-[clamp(3.2rem,1.139vw+2.835rem,5rem)] rounded-full bg-[#F5F5F5] hover:bg-[#f5f5f5c4]  text-[clamp(1.4rem,0.316vw+1.299rem,1.9rem)] font-bold leading-[23.55px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] border-none "
                onClick={() => setOpenModel(false)}
              >
                Cancel
              </Button>
              <Button
                className=" bg-[#4CF37B] hover:bg-[#4cf37bcb]    text-[#000000] rounded-full   w-[clamp(17rem,1.899vw+16.392rem,20rem)] h-[clamp(3.2rem,1.139vw+2.835rem,5rem)] FancyButton text-[clamp(1.4rem,0.316vw+1.299rem,1.9rem)] font-bold leading-[23.55px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none] !mx-[unset] "
                onClick={() => {
                  setSteps(3);
                  setOpenModel(false);
                  setPrivateKey("");
                  setTimeout(() => {
                    removeStep2Data();
                    router.push("/");
                  }, 5 * 60 * 1000);
                }}
              >
                I already Saved it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Component2;

interface PrivateKeySliderProps {
  privateKey: string;
  onSlideComplete?: () => void;
  text?: string;
  sliderWidth?: number;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
}

const PrivateKeySlider: React.FC<PrivateKeySliderProps> = ({
  privateKey,
  onSlideComplete = () => {},
  text = "Slide",
  sliderWidth = 242,
  completed,
  setCompleted,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startPos, setStartPos] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (completed) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setStartX(clientX);
    setStartPos(position);
  };

  const checkCompletion = useCallback(
    (currentPosition: number) => {
      if (currentPosition > sliderWidth * 0.8) {
        setPosition(sliderWidth);
        setCompleted(true);
        onSlideComplete();
      }
    },
    [onSlideComplete, sliderWidth, setCompleted]
  );

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const slider = sliderRef.current;
      if (!slider) return;

      const delta = clientX - startX;
      const newPosition = Math.max(0, Math.min(startPos + delta, sliderWidth));
      setPosition(newPosition);
      checkCompletion(newPosition);
    },
    [isDragging, startX, startPos, sliderWidth, checkCompletion]
  );

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || completed) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    },
    [isDragging, completed, updatePosition]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || completed) return;
    setIsDragging(false);
    checkCompletion(position);

    if (!completed && position <= sliderWidth * 0.8) {
      setPosition(0);
    }
  }, [completed, isDragging, position, sliderWidth, checkCompletion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e);
    const handleTouchMove = (e: TouchEvent) => handleDrag(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragEnd, handleDrag]);

  return (
    <div className="w-full">
      <div className=" ">
        {!completed ? (
          <div className=" bg-[#FFFFFF1A] [box-shadow:inset_0_-1px_4px_0px_#7F7F7F40] md:p-6 sm:p-4 p-2  rounded-[12px] relative md:h-[104px] w-full flex items-center justify-between md:flex-nowrap flex-wrap  md:gap-0 gap-4  ">
            <div className=" flex items-center justify-center text-white pointer-events-none font-medium text-[clamp(12px,1.5vw,17px)]  leading-[100%] tracking-[0%] font-gilroy [text-underline-position:from-font] [text-decoration-skip-ink:none] max-w-[295px] ">
              Click and drag to the right to reveal key
            </div>
            <div
              ref={sliderRef}
              className="relative max-w-[16.2rem] h-[3.6rem] rounded-full cursor-pointer overflow-hidden [box-shadow:inset_0_2px_1px_0px_#FFFFFF40,_inset_0_-4px_2px_0px_#00000040,_0_0_1px_4px_#FFFFFF1A,_0_0_85px_#4963EB80]  bg-[linear-gradient(90deg,#3B9AFF_40%,#D8A336_100%)] "
              style={{
                width: `${sliderWidth}px`,
              }}
            >
              <div
                className="absolute h-full transition-all duration-200 left-2 "
                style={{
                  width: `${(position / sliderWidth) * 100}%`,
                  background:
                    "linear-gradient(90deg, #0095FF 0%, #87CEFA 100%)",
                }}
              />

              <div
                ref={knobRef}
                className="absolute z-10 top-1/2 -translate-y-1/2 h-[2.733rem] w-[6.9rem] rounded-full bg-white shadow-lg transition-transform duration-200"
                style={{
                  left: 4,
                  transform: `translateX(${position}px) translateY(-50%)`,
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              />

              <div className="absolute right-2 z-[9] h-full flex items-center justify-center ">
                <div className="flex items-center gap-0 text-white font-semibold  text-[clamp(10px,1.5vw,12px)] leading-[100%] tracking-[0%] ">
                  {text}
                  <div className=" flex space-x-[-14px] w-fit animate-pulse ">
                    <ChevronRight className=" !w-[2rem] !h-[1.82rem]  " />
                    <ChevronRight className=" !w-[2rem] !h-[1.82rem]  " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ClipboardCopy content={privateKey} />
        )}
      </div>
    </div>
  );
};
