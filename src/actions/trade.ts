"use server";

import { EncryptionService } from "@/api-lib/decryptSecret";
import { AccountsService } from "@/api-lib/services/AccountsService";
import { ConnectionManager } from "@/trade-functions/ConnectionManager";
import { TradeService } from "@/trade-functions/TradeService";
import { TradeData } from "@/trade-functions/types";

export async function executeTrade(apikey: string, tradeData: TradeData) {
  try {
    const result = await AccountsService.getUserName(apikey);
    if (!result.data) {
      throw new Error("Unable to retrieve username from get.trade.");
    }

    const EncryptionServie = new EncryptionService();

    const decryptVal = await EncryptionServie.decrypt(result.data);

    // Test connection first
    await ConnectionManager.testConnection();
    // console.log("tradeData: ", tradeData);

    // Get the singleton connection instance
    const connection = ConnectionManager.getInstance();

    // Create trade service with the connection
    const tradeService = new TradeService(connection);

    // Execute trade
    const tradeResponse = await tradeService.Trade(tradeData, decryptVal);

    // ✅ Ensure failure cases throw an error
    if (!tradeResponse.success) {
      throw new Error(tradeResponse.error || "Trade execution failed");
    }

    return tradeResponse;
  } catch (error) {
    console.error("Trade execution failed:", error);
    throw error;
  }
}
