import { useQuery, useMutation } from "@tanstack/react-query";
import { ALertsTypes, WatchListService } from "../services/WatchListService";

// Hook for connecting wallet
export function useWatchListMutate(key: string) {
  return useMutation({
    mutationKey: ["updateWatchList", key],
    mutationFn: async (TokenAddress: string) =>
      await WatchListService.postUpdateWatchList(TokenAddress, key),
  });
}

// Hook for get watch list
export function useWatchListData(key: string) {
  return useQuery({
    queryKey: ["WatchList", key],
    queryFn: async () => await WatchListService.getWatchList(key),
    staleTime: 0,
  });
}
//################################# Alerts #####################################
// Hook for post alerts
export function useAlertsMutate(key: string) {
  return useMutation({
    mutationKey: ["addAlerts", key],
    mutationFn: async (data: ALertsTypes) =>
      await WatchListService.postAlerts(key, data),
  });
}

// Hook for get alerts
export function useGetAlerts(key: string) {
  return useQuery({
    queryKey: ["alerts", key],
    queryFn: async () => await WatchListService.getAlerts(key),
  });
}

// Hook for delete alerts
export function useAlertsDeleteMutate(key: string) {
  return useMutation({
    mutationKey: ["deleteAlerts", key],
    mutationFn: async (id: number) =>
      await WatchListService.postDeleteAlerts(key, id),
  });
}
