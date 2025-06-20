export interface DepositTXDataPayload {
  senderAddress: string;
  receiverAddress: string;
  txId: string;
  amount: number;
  dateTime: string;
}

export interface DepositHistoryEntry {
  senderAddress: string;
  txId: string;
  amount: number;
  dateTime: string; // Keeping it as string to handle Date conversion later
}

export interface WithdrawHistoryEntry {
  withdrawFrom: string;
  withdrawTo: string;
  txId: string;
  amount: number;
  dateTime: string; // Keeping it as a string to handle Date conversion later
}

export interface WalletHoldings {
  balance: number;
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
}

export interface SwapDataAfterTradeType {
  transactionId: string;
  method: string;
  wallet: string;
  amount: number;
}

export interface getTokenInfoType {
  symbol: string;
  name: string;
  image: string;
  favourite: boolean;
  links: {
    twitter: string;
    telegram: string;
    website: string;
  };
}
export interface ConditionalTradeType {
  tokenAddress: string;
  marketCap: number;
  walletAddress: string;
  amount: number;
}
export interface ConditionalTradePayload {
  tokenAddress: string;
  apiKey: string;
  amount: number;
  walletAddress: string;
  swapiId: string;
}

