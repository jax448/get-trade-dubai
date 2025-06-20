import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import * as bs58 from "bs58";
import {
  SwapResponse,
  BlockhashWithExpiryBlockHeight,
  TradeData,
  SwapData,
} from "@/trade-functions/types";

import { JUPITER_SWAP_API_URL } from "@/trade-functions/constants";

import { transactionSenderAndConfirmationWaiter } from "./transactionSenderAndConfirmationWaiter";

export class TradeService {
  private connection: Connection;
  private tradeHash: string = "";

  constructor(connection: Connection) {
    this.connection = connection;
  }

  private async getSwapTransaction(
    quoteSwapData: SwapData,
    publicKey: string
  ): Promise<SwapResponse> {
    const response = await fetch(JUPITER_SWAP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse: quoteSwapData,
        userPublicKey: publicKey,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    });
    return response.json();
  }

  private getSignature(transaction: VersionedTransaction): string {
    const signature: Uint8Array =
      "signature" in transaction
        ? new Uint8Array(transaction.signature as ArrayLike<number>)
        : new Uint8Array(transaction.signatures[0]);
    if (!signature) {
      throw new Error(
        "Missing transaction signature, the transaction was not signed by the fee payer"
      );
    }
    return bs58.default.encode(signature);
  }

  private async confirmTransaction(
    serializedTransaction: Buffer,
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight
  ) {
    return await transactionSenderAndConfirmationWaiter({
      connection: this.connection,
      serializedTransaction,
      blockhashWithExpiryBlockHeight,
    });
  }

  public async Trade(
    tradeData: TradeData,
    secretKeyString: string
  ): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
  }> {
    try {
      // Initialize keypair
      const secretKey = bs58.default.decode(secretKeyString);
      const keypair = Keypair.fromSecretKey(secretKey);

      console.log("tradeData.swapdata :", tradeData.swapdata);

      // Get swap transaction
      const { swapTransaction, lastValidBlockHeight } =
        await this.getSwapTransaction(
          tradeData.swapdata,
          keypair.publicKey.toString()
        );

      console.log("swap Transaction :", swapTransaction);

      // Process transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      await transaction.sign([keypair]);

      const signature = this.getSignature(transaction);
      const serializedTransaction = Buffer.from(transaction.serialize());
      const blockhash = transaction.message.recentBlockhash;

      const transactionResponse = await this.confirmTransaction(
        serializedTransaction,
        {
          blockhash,
          lastValidBlockHeight,
        }
      );

      console.log("transactionResponse", transactionResponse);

      if (!transactionResponse) {
        throw new Error("Transaction not confirmed");
      }

      this.tradeHash = signature;

      return {
        success: true,
        signature,
      };
    } catch (error) {
      console.log("Trade execution error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  public getTradeHash(): string {
    return this.tradeHash;
  }
}
