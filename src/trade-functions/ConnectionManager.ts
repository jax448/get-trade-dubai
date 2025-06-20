import { Connection } from "@solana/web3.js";
import { CONNECTION_CONFIG, RPC_URLS, selectedRPC } from "./connectionConfig";

export class ConnectionManager {
  private static instance: Connection | null = null;

  public static getInstance(): Connection {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new Connection(
        RPC_URLS[selectedRPC],
        CONNECTION_CONFIG
      );
    }
    return ConnectionManager.instance;
  }

  // Add a method to test connection
  public static async testConnection(): Promise<void> {
    const connection = ConnectionManager.getInstance();
    try {
      await connection.getVersion();
      console.log("Solana connection successful in connection manager.");
    } catch (error) {
      console.error("Failed to connect to Solana network", error);
      throw new Error(
        `Failed to connect to Solana network: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
