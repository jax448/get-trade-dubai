import React, { useState } from "react";
import { Check } from "lucide-react";

import copy from "@public/pics/document-copy.svg";
import Image from "next/image";

interface ClipboardCopyProps {
  content: string;
  showIcon?: boolean;
  className?: string;
  messagePosition?: "bottom" | "top";
}

const ClipboardCopy: React.FC<ClipboardCopyProps> = ({
  content,
  showIcon = true,
  className = "",
  messagePosition = "bottom",
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (content === "") return;
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setShowNotification(true);

      // Reset states after animation
      setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => setIsCopied(false), 300);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className=" w-full  h-fit relative mx-auto ">
      <div
        onClick={handleCopy}
        className={`
          flex items-center gap-2 justify-between cursor-pointer bg-[#FFFFFF1A] 
        md:min-h-[66px] md:rounded-[201px] rounded-[30px]
        group hover:bg-[#ffffff49] md:px-[28px] px-[14px] 
        md:py-[13px] py-[8px] w-full max-w-[340px] mx-auto
        transition-all duration-300 ease-in-out
          ${className}
        `}
      >
        <div
          className=" text-white 
          text-[clamp(1.2rem,0.759vw+0.957rem,2.4rem)] 
          font-semibold  
          leading-[clamp(1.8rem,0.741vw+1.563rem,2.97rem)] 
          text-left 
          [text-underline-position:from-font] 
          [text-decoration-skip-ink:none]  
          break-all 
          truncate 
          max-w-full "
        >
          {content}
        </div>
        {showIcon && (
          <div className=" md:min-w-[2.4rem]  min-w-[1.8rem] p-0 rounded-md bg-gray-700/50 group-hover:bg-[#FFFFFF1A] transition-colors">
            {isCopied ? (
              <Check className="md:w-[2.4rem] md:h-[2.4rem] w-[18px] h-[18px] text-green-400" />
            ) : (
              <div className=" relative md:w-[2.4rem] md:h-[2.4rem] w-[18px] h-[18px] flex items-center justify-center   ">
                <Image
                  src={copy}
                  alt=" "
                  fill
                  className="  group-hover:brightness-[70%]  "
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification */}
      <div
        className={`
          absolute ${messagePosition === "bottom" ? "bottom-0" : "top-0"}
          left-1/2 transform -translate-x-1/2 ${
            messagePosition === "bottom"
              ? "translate-y-full"
              : "-translate-y-full"
          }
          px-3 py-1 rounded-md bg-green-500 text-white text-[1.4rem] leading-[1.6rem] transition-all duration-300
          ${showNotification ? "opacity-100 mb-2" : "opacity-0"}
          whitespace-nowrap shadow-lg
        `}
      >
        Copied to clipboard!
      </div>
    </div>
  );
};

export default ClipboardCopy;
