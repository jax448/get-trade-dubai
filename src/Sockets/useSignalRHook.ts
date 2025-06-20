"use client";
import { useEffect, useCallback } from "react";
import { SignalRConnection } from "@/Sockets/config";

export function useSignalRHook(
  methodName: string,
  callback: (...data: unknown[]) => void
) {
  const connection = SignalRConnection.getInstance().getConnection();

  useEffect(() => {
    connection.on(methodName, (...args) => callback(...args));

    return () => {
      connection.off(methodName, (...args) => callback(...args));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodName, callback]);

  const invoke = useCallback(
    async (method: string, ...args: unknown[]) => {
      try {
        await connection.invoke(method, ...args);
      } catch (err) {
        console.error("SignalR Invoke Error:", err);
      }
    },
    [connection]
  );

  return { invoke };
}
