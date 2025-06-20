interface Window {
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signMessage: (
        message: Uint8Array,
        encoding: string
      ) => Promise<{ signature: Uint8Array }>;
      signAndSendTransaction: (
        transaction: Transaction
      ) => Promise<{ signature: string }>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    };
  };
}
