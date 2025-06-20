import { apiClient } from "../apiClient";

export interface TokenData {
  tokenAddress: string;
  image: string;
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  dateTime?: string;
}
export interface GetAlertsType {
  id: number;
  tokenAddress: string;
  createdDateTime: string;
  status: string;
  price: number;
  liquidity: number;
  name: string;
  symbol: string;
  description: string;
  notificationMessage: string;
}

export interface ALertsTypes {
  price: number | undefined;
  liquidity: number | undefined;
  tokenAddress: string;
}

export const WatchListService = {
  async postUpdateWatchList(TokenAddress: string, key: string) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: string;
    }>(
      `User/UpdateWatchList?TokenAddress=${TokenAddress}`,
      {},
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },

  async getWatchList(key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: TokenData[];
    }>(`User/GetWatchList`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  // ########################### for alerts ########################################

  async postAlerts(key: string, data: ALertsTypes) {
    console.log("alerts data: ", data);

    return apiClient.post<{
      isSuccessfull: boolean;
      data: string;
    }>(`User/SetAlert`, data, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async getAlerts(key: string) {
    return apiClient.get<{
      isSuccessfull: boolean;
      data: GetAlertsType[];
    }>(`User/GetAlerts`, {
      headers: {
        "API-KEY": `${key}`,
      },
    });
  },

  async postDeleteAlerts(key: string, id: number) {
    return apiClient.post<{
      isSuccessfull: boolean;
      data: string;
    }>(
      `User/RemoveAlert?Id=${id}`,
      {},
      {
        headers: {
          "API-KEY": `${key}`,
        },
      }
    );
  },
};

export * from "./WatchListService";
