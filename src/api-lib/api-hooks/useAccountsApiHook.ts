import { useQuery, useMutation } from "@tanstack/react-query";
import { AccountsService } from "../services/AccountsService";
import type {
  DepositTXDataPayload,
  SwapDataAfterTradeType,
  ConditionalTradeType,
} from "@/types/apiTypes";
// import { TrendingTimeInteval } from "@/trade-functions/types";

// Hook for connecting wallet
export function useConnectWallet(walletString: string) {
  return useMutation({
    mutationKey: ["connectWallet"],
    mutationFn: async () => await AccountsService.connectWallet(walletString),
  });
}

// Hook for generating wallet
export function useGenerateWallet(walletString: string) {
  return useMutation({
    mutationKey: ["generateWallet"],
    mutationFn: async () => await AccountsService.generateWallet(walletString),
  });
}

// Hook for getting balance
export function useGetBalance(
  walletString: string,
  key: string,
  pollingInterval = 30000
) {
  return useQuery({
    queryKey: ["balance", walletString],
    queryFn: async () => await AccountsService.getBalance(walletString, key),
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: pollingInterval / 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for getting balance withuot Pooiling
export function useGetBalanceWithoutPooling(walletString: string, key: string) {
  return useQuery({
    queryKey: ["firstbalance", walletString],
    queryFn: async () =>
      await AccountsService.getBalanceWithoutPooling(walletString, key),
    staleTime: 0,
  });
}

// Hook for getting deposit history
export function useGetDepositHistory(walletString: string, key: string) {
  return useQuery({
    queryKey: ["depositHistory", walletString],
    queryFn: async () =>
      await AccountsService.getDepositHistory(walletString, key),
    staleTime: 0,
    refetchInterval: 30000, // Auto refetch every 30s
  });
}

// Hook for getting withdraw history
export function useGetWithdrawHistory(walletString: string, key: string) {
  return useQuery({
    queryKey: ["withdrawHistory", walletString],
    queryFn: async () =>
      await AccountsService.getWithdrawHistory(walletString, key),
    staleTime: 0,
    refetchInterval: 30000, // Auto refetch every 30s
  });
}

// Hook for deposit TX data
export function useDepositTXData(key: string) {
  return useMutation({
    mutationKey: ["depositTXData"],
    mutationFn: async (data: DepositTXDataPayload) =>
      await AccountsService.depositTXData(data, key),
  });
}

// Hook for withdrawing
export function useWithdraw(key: string) {
  return useMutation({
    mutationKey: ["withdraw"],
    mutationFn: async (data: { address: string; amount: number }) =>
      await AccountsService.withdraw(data.address, data.amount, key),
  });
}

// Hook for getting user holdings
export function useGetHoldings(walletAddress: string, key: string) {
  return useQuery({
    queryKey: ["holdings", walletAddress],
    queryFn: async () => await AccountsService.getHoldings(walletAddress, key),
    staleTime: 5000, // 5 second
    refetchInterval: 30000, // Auto refetch every 30s
  });
}

// Hook for getting token balance
export function useGetTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  key: string
) {
  return useQuery({
    queryKey: ["tokenBalance", tokenAddress, walletAddress],
    queryFn: async () =>
      await AccountsService.getTokenBalance(tokenAddress, walletAddress, key),
    staleTime: 0,
  });
}

// Hook for getting trade details
export function useGetTradeDetails(
  tokenAddress: string,
  amount: number,
  method: string,
  walletAddress: string,
  key: string
) {
  return useQuery({
    queryKey: ["tradeDetails", tokenAddress, amount, method, walletAddress],
    queryFn: async () =>
      await AccountsService.getTradeDetails(
        tokenAddress,
        amount,
        method,
        walletAddress,
        key
      ),
  });
}

// Hook for withdrawing
export function useSwapDataAfterTrade(key: string) {
  return useMutation({
    mutationKey: ["SwapDataAfterTrade"],
    mutationFn: async (data: SwapDataAfterTradeType) =>
      await AccountsService.postSwapDataAfterTrade(data, key),
  });
}

export function useGetPublicTokenData(key: string, urlstring: string) {
  return useQuery({
    queryKey: ["publicTokenData"],
    queryFn: async () => await AccountsService.getTokenData(key, urlstring),
    refetchInterval: 1000, // ⏳ Poll every 2 seconds
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTrendingTokenData(key: string, urlstring: string) {
  return useQuery({
    queryKey: ["publicTrendingTokenData"],
    queryFn: async () =>
      await AccountsService.getTrendingTokenData(key, urlstring),
    refetchInterval: 1000, // ⏳ Poll every 2 seconds
    refetchIntervalInBackground: true,

    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTokenMetrics(tokenAddress: string) {
  return useQuery({
    queryKey: ["tokenMetrics", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const response = await AccountsService.getTokenMetrics(tokenAddress);
      return response.data;
    },
    enabled: !!tokenAddress,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useTokenByAddress(tokenAddress: string, enabled = true) {
  return useQuery({
    queryKey: ["tokenByAddress", tokenAddress],
    queryFn: async () => {
      const response = await AccountsService.getTokenByAddress(tokenAddress);
      const tokenArray = response.data;

      if (!Array.isArray(tokenArray) || tokenArray.length === 0) {
        throw new Error("Token not found or invalid address");
      }

      return tokenArray;
    },
    enabled,
    staleTime: 60000,
    retry: false,
  });
}

export function useTokenMarketCap(tokenAddress: string) {
  return useQuery({
    queryKey: ["tokenMarketCap", tokenAddress],
    queryFn: async () => await AccountsService.getTokenMarketCap(tokenAddress),
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTokenSecurity(tokenAddress: string) {
  return useQuery({
    queryKey: ["tokenSecurity", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const response = await AccountsService.getTokenSecurity(tokenAddress);
      return response.data;
    },
    enabled: !!tokenAddress,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTokenInfo(
  tokenAddress: string,
  walletAddress?: string,
  apiKey?: string
) {
  return useQuery({
    queryKey: ["GetTokenInfo", tokenAddress],
    queryFn: async () =>
      await AccountsService.getTokenInfo(tokenAddress, walletAddress, apiKey),
    // mark stale immediately so next fetch works
    // Removed keepPreviousData as it is not a valid property
  });
}
export function useGetTokenHolders(tokenAddress: string) {
  return useQuery({
    queryKey: ["GetTokenHolders", tokenAddress],
    queryFn: async () => await AccountsService.getTokenHolders(tokenAddress),
    enabled: !!tokenAddress,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTokenTransaction(tokenAddress: string) {
  return useQuery({
    queryKey: ["GetTokenTransaction", tokenAddress],
    queryFn: async () =>
      await AccountsService.getTokenTransaction(tokenAddress),
    enabled: !!tokenAddress,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useGetTokenTopTraders(tokenAddress: string) {
  return useQuery({
    queryKey: ["GetTokenTopTraders", tokenAddress],
    queryFn: async () => await AccountsService.getTokenTopTraders(tokenAddress),
    enabled: !!tokenAddress,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}
export function usePlaceConditionalTrade(key: string) {
  return useMutation({
    mutationKey: ["PlaceConditionalTrade"],
    mutationFn: async (data: ConditionalTradeType) =>
      await AccountsService.postConditionalTrade(data, key),
  });
}
export function usePendingConditionalTrade(key: string) {
  return useQuery({
    queryKey: ["PendingConditionalTrade"],
    queryFn: () => AccountsService.getPendingConditionalTrade(key),
    enabled: !!key,
    refetchInterval: 1000,
  });
}
