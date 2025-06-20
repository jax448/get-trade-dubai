// components/ShareModal.tsx
"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import copyIcon from "@public/pics/document-copy.svg";

import Sharemodalimg1 from "@public/pics/ShareModalImages (1).png";
import Sharemodalimg2 from "@public/pics/ShareModalImages (2).png";
import Sharemodalimg3 from "@public/pics/ShareModalImages (3).png";
import Sharemodalimg4 from "@public/pics/ShareModalImages (4).png";
import Sharemodalimg5 from "@public/pics/ShareModalImages (5).png";

// Import react-share components
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "react-share";

import { useShareModal } from "@/store/ShareModal";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Custom CopyButton component
const CopyButton: React.FC<{
  text: string;
  children: React.ReactNode;
  className?: string;
}> = ({ text, children, className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.custom(
        (t) => (
          <CustomToast
            title="Copied to clipboard!"
            type="success"
            key={t.id}
            onClose={() => toast.dismiss(t.id)}
            t={t}
          />
        ),
        {
          duration: 800,
        }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.custom(
        (t) => (
          <CustomToast
            title="Failed to copy text."
            type="error"
            key={t.id}
            onClose={() => toast.dismiss(t.id)}
            t={t}
          />
        ),
        {
          duration: 800,
        }
      );
    }
  };
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        size="sm"
        onClick={copyToClipboard}
        className={cn(
          "bg-[#F1F2FF0D]  border-[#FFFFFF1A] relative overflow-hidden",
          copied && "bg-green-500 hover:bg-green-600 text-white",
          className
        )}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

const ShareModal: React.FC = () => {
  const isOpen = useShareModal((state) => state.isShareModalOpen);
  const setIsOpen = useShareModal((state) => state.toggleShareModal);
  const shareData = useShareModal((state) => state.shareData);

  const {
    // text,
    title,
    url,
    description,
    // image
  } = shareData;

  const platforms = [
    {
      name: "Twitter",
      icon: <Image src={Sharemodalimg5} alt="" className="w-[24px] h-[24px]" />,
      button: (
        <TwitterShareButton
          url={url || ""}
          title={description}
          className="flex items-center justify-center"
          hashtags={["Solana", "Crypto", "Web3"]}
        >
          <Image src={Sharemodalimg5} alt="" className="w-[24px] h-[24px]" />
        </TwitterShareButton>
      ),
    },
    {
      name: "Facebook",
      icon: <Image src={Sharemodalimg3} alt="" className="w-[24px] h-[24px]" />,
      button: (
        <FacebookShareButton
          url={url || ""}
          // quote={description}
          className="flex items-center justify-center"
          hashtag="#Solana"
        >
          <Image src={Sharemodalimg3} alt="" className="w-[24px] h-[24px]" />
        </FacebookShareButton>
      ),
    },
    {
      name: "LinkedIn",
      icon: <Image src={Sharemodalimg4} alt="" className="w-[24px] h-[24px]" />,
      button: (
        <LinkedinShareButton
          url={url || ""}
          title={title}
          summary={description}
          className="flex items-center justify-center"
        >
          <Image src={Sharemodalimg4} alt="" className="w-[24px] h-[24px]" />
        </LinkedinShareButton>
      ),
    },
    {
      name: "Email",
      icon: <Image src={Sharemodalimg2} alt="" className="w-[24px] h-[24px]" />,
      button: (
        <EmailShareButton
          url={url || ""}
          subject={title}
          body={`${description}\n\n`}
          className="flex items-center justify-center"
        >
          <Image src={Sharemodalimg2} alt="" className="w-[24px] h-[24px]" />
        </EmailShareButton>
      ),
    },
  ];

  const nativeShare = async () => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[800px] w-full bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)] border border-[#161936] text-white md:py-[4rem] py-[3rem] !rounded-[18px]">
        <DialogHeader className="relative">
          <h1 className="border-b border-b-[#FFFFFF1A] md:pb-[2rem] pb-[1rem] text-[#FEFEFF] font-bold text-[28px] leading-[40px] tracking-[-2%] text-center">
            Share Wallet
          </h1>
        </DialogHeader>
        <DialogDescription className="lg:px-[2rem]">
          <div className="grid gap-6 md:py-6 py-3 ">
            {/* Copy link section */}
            <div className="flex flex-col gap-3 lg:pb-10 pb-4 border-b border-[#2C2F36]">
              <p className="font-semibold text-[14px] lg:leading-[56.28px] leading-[30px] tracking-[-2%] text-left text-white">
                Or copy link
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-[#F1F2FF0D] flex items-center md:h-[41px] h-[50px] border border-[#FFFFFF1A] px-4 py-3 flex-1  break-all max-w-full text-[#FFFFFFCC]  font-normal text-[12px] leading-[100%] tracking-[0%]">
                  {url || ""}
                </div>
                <CopyButton
                  text={url || ""}
                  className="md:h-[41px] h-[50px] w-[48px] border rounded-none"
                >
                  <Image
                    src={copyIcon}
                    alt=""
                    className="!w-[20px] !h-[20px]"
                  />
                </CopyButton>
              </div>
            </div>

            {/* Platform sharing buttons */}
            <div>
              <p className="font-semibold text-[14px] lg:leading-[56.28px] leading-[30px] tracking-[-2%] text-left text-white">
                Share to
              </p>
              <div className="flex items-center justify-start gap-6 mt-2 flex-wrap">
                {platforms.map((platform) => (
                  <TooltipProvider delayDuration={100} key={platform.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-transparent hover:bg-transparent p-0 text-white transition-all duration-100">
                          {platform.button}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[rgb(76,243,123)] border-none">
                        <p className="text-black font-bold text-[16px] p-2">
                          Share on {platform.name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

                {typeof navigator !== "undefined" &&
                  typeof navigator.share === "function" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={nativeShare}
                            className="bg-transparent h-[unset] hover:bg-transparent p-0 text-white transition-all duration-200"
                          >
                            <Image
                              src={Sharemodalimg1}
                              alt=""
                              className="w-[24px] h-[24px]"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[rgb(76,243,123)] border-none">
                          <p className="text-black font-bold text-[16px] p-2">
                            More options
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
