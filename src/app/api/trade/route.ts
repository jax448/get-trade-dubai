import { NextResponse } from "next/server";
import { AccountsService } from "@/api-lib/services/AccountsService";
import { executeTrade } from "@/actions/trade";
import type { TradeData } from "@/trade-functions/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tokenAddress, buyAmount, key, getTradePublicKey } = body;

    if (!tokenAddress || !buyAmount || !key || !getTradePublicKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const amount = Number(buyAmount);

    const response = await AccountsService.getTradeDetails(
      tokenAddress,
      amount,
      "buy",
      getTradePublicKey,
      key
    );

    if (!response.data || response.data.swapMode === null) {
      throw new Error("No Route Found. Try different amount.");
    }

    const tradeData: TradeData = {
      selectedSol: buyAmount,
      swapdata: response.data,
    };

    const result = await executeTrade(key, tradeData);

    if (!result.success || !result.signature) {
      throw new Error(result.error || "Trade execution failed");
    }

    const responseSwapData = {
      transactionId: result.signature,
      method: "buy",
      wallet: getTradePublicKey || "",
      amount: Number(tradeData.selectedSol),
    };

    const sd = await AccountsService.postSwapDataAfterTrade(
      responseSwapData,
      key
    );

    if (!sd || !sd.isSuccessfull) {
      throw new Error("failed to send data in to the .net backend.");
    }

    return NextResponse.json({
      success: true,
      data: responseSwapData,
    });
  } catch (error: unknown) {
    console.error("Trade failed:", error);
    const message =
      error instanceof Error ? error.message : "Trade execution failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
