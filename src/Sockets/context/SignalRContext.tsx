"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SignalRConnection } from "@/Sockets/config";

type SignalRContextType = {
  isConnected: boolean;
};

const SignalRContext = createContext<SignalRContextType>({
  isConnected: false,
});

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connection = SignalRConnection.getInstance();

    connection.getConnection().onclose(() => setIsConnected(false));
    connection.getConnection().onreconnecting(() => setIsConnected(false));
    connection.getConnection().onreconnected(() => setIsConnected(true));

    connection.startConnection().then(() => setIsConnected(true));

    return () => {
      connection.getConnection().stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
}

export const useSignalRContext = () => useContext(SignalRContext);
