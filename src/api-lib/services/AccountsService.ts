import type {
  DepositHistoryEntry,
  DepositTXDataPayload,
  getTokenInfoType,
  SwapDataAfterTradeType,
  WalletHoldings,
  WithdrawHistoryEntry,
  ConditionalTradeType,
  ConditionalTradePayload,
} from "@/types/apiTypes";
import { apiClient } from "../apiClient";
import type {
  SwapData,
  TokenMetrics,
  TokenSecurityInfo,
  TokenTopHoldersType,
  TokenTransactionType,
  TokenTopTraderstype,
  SearchTokenData,
  marketCapType,
  // TrendingTimeInteval,
  TrendingTokenInfotype,
  NewPairsTableDataType,
} from "@/trade-functions/types";

export const AccountsService = {
  async getTokenInfo(
    TokenAddress: string,
    walletAddress?: string,
    apikey?: string
  ) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: getTokenInfoType;
    }>(
      `User/GetTokenInfo?TokenAddress=${TokenAddress}&WalletAddress=${walletAddress}`,
      {
        headers: {
          "API-KEY": `${apikey}`,
        },
      }
    );
  },

  async getUserName(apikey: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: string;
    }>("user/GetUserName", {
      headers: {
        "API-KEY": `${apikey}`,
      },
    });
  },

  async connectWallet(walletString: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: {
        apiKey: string;
        balance: string;
        walletAddress: string;
      };
    }>(`Account/ConnectWallet?wallet=${walletString}`, {}, {});
  },

  async generateWallet(walletString: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: {
        apiKey: string;
        privateKey: string;
        walletAddress: string;
      };
    }>(`Account/GenerateWallet?wallet=${walletString}`, {}, {});
  },

  async getBalance(walletString: string, key: string) {
    if (!key || !walletString) return;

    return apiClient.get<{
      isSuccessfull: boolean;
      data: {
        balance: string;
      };
    }>(`Account/GetBalance?wallet=${walletString}`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },
  async getBalanceWithoutPooling(walletString: string, key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: {
        balance: string;
      };
    }>(`Account/GetBalance?wallet=${walletString}`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getDepositHistory(walletString: string, key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: DepositHistoryEntry[];
    }>(`Account/GetDepositHistory?wallet=${walletString}`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getWithdrawHistory(walletString: string, key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: WithdrawHistoryEntry[];
    }>(`Account/GetWIthdrawHistory?wallet=${walletString}`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async depositTXData(data: DepositTXDataPayload, key: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: {
        message: string;
      };
    }>("Account/DepositTXData", data, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async withdraw(walletString: string, amount: number, key: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: {
        message: string;
      };
    }>(
      `Account/Withdraw?wallet=${walletString}&amount=${amount}`,
      {},
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },

  // New Endpoints Based on the Image
  async getHoldings(walletAddress: string, key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: WalletHoldings[];
    }>(`User/GetHoldings?WalletAddress=${walletAddress}`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getTokenBalance(
    TokenAddress: string,
    walletAddress: string,
    key: string
  ) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: number;
    }>(
      `User/GetTokenBalance?WalletAddress=${walletAddress}&TokenAddress=${TokenAddress}`,
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },

  async getTradeDetails(
    TokenAddress: string,
    amount: number,
    method: string,
    walletAddress: string,
    key: string
  ) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: SwapData;
    }>(
      `User/GetTradeDetails?TokenAddress=${TokenAddress}&Amount=${amount}&Method=${method}&Wallet=${walletAddress}`,
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },

  async postSwapDataAfterTrade(
    SwapDataAfterTrade: SwapDataAfterTradeType,
    key: string
  ) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: string;
    }>(
      `User/PostTradeData`,
      {
        dateTime: new Date().toISOString(),
        transactionId: SwapDataAfterTrade.transactionId,
        method: SwapDataAfterTrade.method,
        wallet: SwapDataAfterTrade.wallet,
        amount: SwapDataAfterTrade.amount,
      },
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },

  async getTokenData(key: string, urlstring: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: NewPairsTableDataType[];
    }>(`Public/GetTokenData${urlstring}`, {
      cache: "no-cache",
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getTrendingTokenData(key: string, urlstring: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TrendingTokenInfotype[];
    }>(`Public/GetTrendingTokens?${urlstring}`, {
      cache: "no-cache",
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getTokenByAddress(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: SearchTokenData[];
    }>(`Public/SearchToken?TokenAddress=${TokenAddress}`);
  },

  async getTokenMarketCap(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: marketCapType;
    }>(`Public/GetMarketCap?TokenAddress=${TokenAddress}`);
  },

  async getTokenMetrics(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenMetrics;
    }>(`Public/GetTokenHistoricalData?TokenAddress=${TokenAddress}`);
  },
  async getTokenSecurity(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenSecurityInfo;
    }>(`Public/GetTokenSecurity?TokenAddress=${TokenAddress}`);
  },

  // get graph holders
  async getTokenHolders(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenTopHoldersType[];
    }>(`Public/GetHolders?TokenAddress=${TokenAddress}`);
  },

  // get graph transaction
  async getTokenTransaction(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenTransactionType[];
    }>(`Public/GetTransactions?TokenAddress=${TokenAddress}`);
  },

  // get graph top traders
  async getTokenTopTraders(TokenAddress: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenTopTraderstype[];
    }>(`Public/GetTopTraders?TokenAddress=${TokenAddress}`);
  },
  async postConditionalTrade(tradeData: ConditionalTradeType, key: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: {
        message: string;
      };
    }>(
      `User/PlaceConditionalTrade`,
      {
        tokenAddress: tradeData.tokenAddress,
        marketCap: tradeData.marketCap,
        walletAddress: tradeData.walletAddress,
        amount: tradeData.amount,
      },
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },
  async getPendingConditionalTrade(key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: ConditionalTradePayload;
    }>(`User/GetPendingConditionalTrade`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },
  //
};

export * from "./AccountsService";
