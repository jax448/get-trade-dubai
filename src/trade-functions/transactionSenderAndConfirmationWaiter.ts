import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  SendTransactionError,
} from "@solana/web3.js";
// import { wait } from "./wait";

export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

type TransactionSenderAndConfirmationWaiterArgs = {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
};

const SEND_OPTIONS = {
  skipPreflight: false,
};

// export async function transactionSenderAndConfirmationWaiter({
//   connection,
//   serializedTransaction,
//   blockhashWithExpiryBlockHeight,
// }: TransactionSenderAndConfirmationWaiterArgs): Promise<string | null> {
//   try {
//     console.log("Sending transaction...");
//     const txid = await connection.sendRawTransaction(
//       serializedTransaction,
//       SEND_OPTIONS
//     );
//     console.log("Transaction Sent! TXID:", txid);

//     const controller = new AbortController();
//     const abortSignal = controller.signal;

//     const abortableResender = async () => {
//       while (!abortSignal.aborted) {
//         await wait(2_000);
//         try {
//           await connection.sendRawTransaction(
//             serializedTransaction,
//             SEND_OPTIONS
//           );
//           console.log("Transaction resent.");
//         } catch (e) {
//           console.log("Failed to resend transaction:", e);
//           await logErrorDetails(e, connection);
//         }
//       }
//     };

//     abortableResender().catch((e) => console.log("Resender error:", e));

//     const lastValidBlockHeight =
//       blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

//     try {
//       console.log("Waiting for confirmation...");
//       await connection.confirmTransaction(
//         {
//           ...blockhashWithExpiryBlockHeight,
//           lastValidBlockHeight,
//           signature: txid,
//         },
//         "confirmed"
//       );
//       console.log("Transaction confirmed via confirmTransaction.");
//     } catch (e) {
//       console.log("Error confirming transaction:", e);
//       await logErrorDetails(e, connection);
//     }

//     for (let i = 0; i < 10; i++) {
//       try {
//         const txStatus = await connection.getSignatureStatus(txid, {
//           searchTransactionHistory: true,
//         });

//         if (
//           txStatus?.value?.confirmationStatus === "confirmed" ||
//           txStatus?.value?.confirmationStatus === "finalized"
//         ) {
//           console.log("Transaction confirmed:", txid);
//           controller.abort();
//           return txid;
//         }
//       } catch (e) {
//         console.log("Error checking transaction status:", e);
//         await logErrorDetails(e, connection);
//       }

//       await wait(2_000);
//     }

//     console.warn("Transaction not confirmed after multiple attempts.");
//     return null;
//   } catch (e) {
//     console.log("Transaction error:", e);
//     await logErrorDetails(e, connection);
//     return null;
//   }
// }

export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: TransactionSenderAndConfirmationWaiterArgs): Promise<string | null> {
  let txid: string | null = null;
  let retryCount = 0;
  const maxRetries = 3;

  console.log("Sending transaction...");

  while (retryCount < maxRetries) {
    try {
      txid = await connection.sendRawTransaction(
        serializedTransaction,
        SEND_OPTIONS
      );
      console.log("Transaction Sent! TXID:", txid);
      break; // Exit retry loop if transaction is successfully sent
    } catch (e) {
      console.log(`Error sending transaction (Attempt ${retryCount + 1}):`, e);
      await logErrorDetails(e, connection);
      retryCount++;
      await wait(2_000 * retryCount); // Exponential backoff
    }
  }

  if (!txid) {
    console.warn("Failed to get TXID after multiple attempts.");
    return null;
  }

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const lastValidBlockHeight =
    blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

  try {
    console.log("Waiting for confirmation...");
    await connection.confirmTransaction(
      {
        ...blockhashWithExpiryBlockHeight,
        lastValidBlockHeight,
        signature: txid,
      },
      "confirmed"
    );
    console.log("Transaction confirmed via confirmTransaction.");
    return txid;
  } catch (e) {
    console.log("Error confirming transaction:", e);
    await logErrorDetails(e, connection);
  }

  for (let i = 0; i < 10; i++) {
    if (abortSignal.aborted) break;

    try {
      const txStatus = await connection.getSignatureStatus(txid, {
        searchTransactionHistory: true,
      });

      if (
        txStatus?.value?.confirmationStatus === "confirmed" ||
        txStatus?.value?.confirmationStatus === "finalized"
      ) {
        console.log("Transaction confirmed:", txid);
        controller.abort();
        return txid;
      }
    } catch (e) {
      console.log("Error checking transaction status:", e);
      await logErrorDetails(e, connection);
    }

    await wait(2_000);
  }

  console.warn("Transaction not confirmed after multiple attempts.");
  return null;
}

async function logErrorDetails(error: unknown, connection: Connection) {
  if (error instanceof SendTransactionError) {
    console.log("Detailed error logs:");
    console.log("Error Message:", error.message);
    console.log("Error Stack:", error.stack);

    if ("logs" in error && error.logs) {
      console.log("Transaction Logs:", error.logs);
    } else if ("getLogs" in error && typeof error.getLogs === "function") {
      try {
        const logs = await error.getLogs(connection);
        console.log("Retrieved Logs:", logs);
      } catch (logError) {
        console.log("Failed to fetch logs:", logError);
      }
    }
  } else {
    console.log("General Error:", error);
  }
}
