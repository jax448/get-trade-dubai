export interface QuoteResponse {
  // Add specific quote response fields based on your needs
  [key: string]: string | number | boolean | null | undefined;
}

export interface SwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
}

export interface BlockhashWithExpiryBlockHeight {
  blockhash: string;
  lastValidBlockHeight: number;
}

// export interface AdvancedSettings {
//   slippage?: string;
//   smartMevProtection?: boolean;
//   speed?: "default" | "auto";
//   priorityFee?: string;
//   briberyAmount?: string;
// }

export interface TradeData {
  selectedSol: string | number;
  swapdata: SwapData;
  // advancedSettings: AdvancedSettings;
}

// main trade types that is gomong from the backend
interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapData {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut"; // Example values, adjust according to actual use
  slippageBps: number;
  platformFee: number | null; // Optional value, could be null
  priceImpactPct: string;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

// export interface TokenInfo {
//   favourite: boolean;
//   buySellPercentages: {
//     percent1h: string;
//     percent2h: string;
//     percent4h: string;
//     percent8h: string;
//     percent24h: string;
//     percent30m: string;
//   };
//   t: {
//     tokenAddress: string;
//     price: number | null;
//     vol30m: number;
//     vol1h: number;
//     vol2h: number;
//     vol4h: number;
//     vol8h: number;
//     vol24h: number;
//     dateTime: string; // ISO 8601 format
//     source: string;
//     name: string;
//     marketCap: number;
//     image: string;
//     liquidity: number;
//     holders: number;
//     symbol: string;
//     volBuy30mUsd: string;
//     volSell30mUsd: string;
//     volSell1hUsd: string;
//     volBuy1hUsd: string;
//     volBuy2hUsd: string;
//     volSell2hUsd: string;
//     volSell4hUsd: string;
//     volBuy4hUsd: string;
//     volBuy8hUsd: string;
//     volSell8hUsd: string;
//     volSell24hUsd: string;
//     volBuy24hUsd: string;
//     links: {
//       website: string | null;
//       telegram: string | null;
//       twitter: string | null;
//     };
//   };
// }

export interface NewPairsTableDataType {
  tokenAddress: string;
  price: number;
  dateTime: string; // ISO timestamp; you can convert to Date if needed
  source: string | null;
  name: string;
  marketCap: number;
  image: string;
  liquidity: number;
  holders: number;
  symbol: string;
  timeInterval: string | null;
  makers: string | null; // or null; use a specific type if you know the structure
  pricePercentages: {
    priceChange1min: number;
    priceChange5min: number;
    priceChange1h: number;
    priceChange6h: number;
    priceChange24h: number;
  };
  timeData: {
    txvol1m: number;
    txvol5m: number;
    txvol1h: number;
    txvol6h: number;
    txvol24h: number;
    transactions1m: number;
    transactions5m: number;
    transactions1h: number;
    transactions6h: number;
    transactions24h: number;
  };
  buySell_Percentages: {
    percent1m: string;
    percent5m: string;
    percent1h: string;
    percent6h: string;
    percent24h: string;
  };
  links: {
    website: string | null;
    telegram: string | null;
    twitter: string | null;
  };
  favourite: boolean;
}

// export type TimeInterval = "1m" | "5m" | "1h" | "6h" | "24h";

// // Flattened version (matches your raw API output structure)
// export type FlattenedTimeData = {
//   [K in TimeInterval as `txvolBuy${K}`]?: number;
// } & {
//   [K in TimeInterval as `txvolSell${K}`]?: number;
// } & {
//   [K in TimeInterval as `txvol${K}`]?: number;
// } & {
//   [K in TimeInterval as `transactions${K}`]?: number;
// } & {
//   [K in TimeInterval as `percent${K}`]?: string;
// };

export interface TrendingTokenInfotype {
  tokenAddress: string;
  price: number;
  dateTime: string; // or Date if you convert it
  source: string | null;
  name: string;
  marketCap: number;
  image: string;
  liquidity: number;
  holders: number;
  symbol: string;
  makers: string | null; // replace `any` with a specific type if known
  favourite: boolean;
  transactions24h: number;
  pricePercentages: {
    priceChange1min: number | null;
    priceChange5min: number | null;
    priceChange1h: number | null;
    priceChange6h: number | null;
    priceChange24h: number | null;
  };
  links: {
    website: string | null;
    telegram: string | null;
    twitter: string | null;
  };
  volumes: {
    txvol1m: number;
    txvol5m: number;
    txvol1h: number;
    txvol6h: number;
    txvol24h: number;
  };
  dataRate: {
    percent1m: string;
    percent5m: string;
    percent1h: string;
    percent6h: string;
    percent24h: string;
  };
}

export type TrendingTimeInteval =
  | "1 Minute Ago"
  | "5 Minutes Ago"
  | "1 Hour Ago"
  | "6 Hours Ago"
  | "24 Hours Ago";

export interface TokenTopHoldersType {
  wallet: string;
  amount: number;
  value: number;
  owned: number;
  transactions: TokenTransactionType[];
}

export interface TokenTopTraderstype {
  maker: string;
  tradeBuy: number;
  tradeSell: number;
  investedVolume: number;
  investedUSD: number;
  soldUSD: number;
  soldVolume: number;
  p_L: number;
  transactions: TokenTransactionType[];
}

export interface TokenMetrics {
  marketCap: number;
  liquidity: number;
  priceUSD: number;
  priceSol: string;
  fdv: number;
  price30MinPercent: number;
  price1HourPercent: number;
  price4HourPercent: number;
  price24HourPercent: number;
  vol24Hours: number;
  vol24HoursPercentChange: number;
  buyVol24Hours: number;
  sellVol24Hours: number;
  buy: number;
  sell: number;
  holders: number;
  markets: number;
  cirSupply: number;
  totalSupply: number;
  top10HoldersPercent: number;
  watchers: number;
  txnS24h: number;
}
export interface TokenSecurityInfo {
  mintAuth: string | null;
  freezeAuth: string | null;
  top10HoldersPercent: number;
  caDeployer: string;
  lpCreator: string;
  lpBurned: boolean;
}
export interface SearchTokenData {
  price: number;
  symbol: string;
  name: string;
  address: string;
  chain: string;
  image: string;
  createdTime: string;
}
export interface marketCapType {
  marketCap: number;
  price: number;
}

export interface TokenTransactionType {
  dateTime: string; // ISO date string
  type: "buy" | "sell";
  maker: string;
  totalUSD: number;
  price: number;
  priceUSD: number;
  priceSol: string; // still a string in the API
  amount: number;
  totalSol: number;
  txid: string;
}
