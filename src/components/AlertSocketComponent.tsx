"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSignalRContext } from "@/Sockets/context/SignalRContext";
import { SignalRConnection } from "@/Sockets/config";
import { X, Bell } from "lucide-react";
import { useSolanaAuthStore } from "@/store/auth";

interface Alert {
  dateTime: null;
  image: string;
  name: string;
  notificationMessage: string;
  status: string;
  symbol: string;
  tokenAddress: string;
  alertId: string;
  apiKey: string;
}

const AlertNotification = () => {
  const { isConnected } = useSignalRContext();
  const [notifications, setNotifications] = useState<Alert[]>([]);

  const key = useSolanaAuthStore((state) => state.key);

  useEffect(() => {
    if (!isConnected) return;

    const connection = SignalRConnection.getInstance();

    connection.getConnection().on("NewAlert", (newAlert: Alert) => {
      console.log("new alert from socket: ", newAlert);

      if (key === newAlert.apiKey) {
        setNotifications((prev) => [...prev, newAlert]);
      }

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((alert) => alert.alertId !== newAlert.alertId)
        );
      }, 5000000);
    });

    return () => {
      connection.getConnection().off("NewAlert");
    };
  }, [isConnected, key]);

  return (
    <div className="fixed top-[24px] right-[24px] z-[50] flex flex-col gap-[12px] w-full max-w-[350px]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.alertId}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E1E1E] border border-white/10 shadow-[0px_10px_25px_rgba(0,0,0,0.25)] rounded-[12px] p-[20px] flex items-start gap-[16px]"
          >
            <div className="min-w-[48px] h-[48px] rounded-full bg-[#FF5EBD] flex items-center justify-center">
              <Bell className="w-[24px] h-[24px] text-[#1E1E1E]" />
            </div>

            <div className=" flex-1 ">
              <div className="flex items-start justify-between ">
                <p className="text-white text-[16px] mt-[8px] mb-[8px]">
                  {notification.notificationMessage}
                </p>
                <div className="flex justify-end items-start">
                  <button
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter(
                          (alert) => alert.alertId !== notification.alertId
                        )
                      )
                    }
                    className="text-white/60 hover:text-white p-[4px]"
                  >
                    <X className="w-[20px] h-[20px]" />
                  </button>
                </div>
              </div>
              <Link
                href={`/trade/${notification.tokenAddress}`}
                className="text-[#FF5EBD] underline text-[14px]"
              >
                View Trade
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertNotification;
