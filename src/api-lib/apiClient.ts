import { API_BASE_URL, API_HEADERS } from "./config";

interface ApiError {
  message?: string;
  error?: string;
  errors?: {
    title: string;
  };
  errorCode?: number;
  statusCode?: number;
  data?: unknown;
  isSuccessfull?: boolean;
}

class ApiClient {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...API_HEADERS,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();

        // Only log errors in non-production environments
        if (process.env.NODE_ENV !== "production") {
          console.log("API Error Response:", errorData);
        }

        // Extract error message from various possible formats
        const errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.errors?.title ||
          (typeof errorData === "string" ? errorData : null) ||
          `Request failed with status ${response.status}`;

        // Create an error object with additional context
        const error = new Error(errorMessage);
        (error as ApiError).statusCode = response.status;
        (error as ApiError).data = errorData;

        throw error;
      }

      const result = await response.json();

      // Only log the result in non-production environments
      if (process.env.NODE_ENV !== "production") {
        console.log("Data from Backenf (apiclient): ", result);
      }

      return result;
    } catch (error) {
      // Handle fetch failures (network errors, etc.)
      if (error instanceof Error) {
        throw error;
      }

      // Handle unexpected error formats
      throw new Error(
        typeof error === "string"
          ? error
          : "An unexpected error occurred during the API request"
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown, options?: RequestInit) {
    // Only log the data in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.log("POST data sending to api (apiclient): ", data);
    }

    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.log("FORMDATA data sending to api (apiclient) :");
      for (const [key, value] of Array.from(formData.entries())) {
        console.log(key, value);
      }
    }

    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData, // Use FormData directly
    });
  }

  async put<T>(endpoint: string, data: unknown, options?: RequestInit) {
    if (process.env.NODE_ENV !== "production") {
      console.log("PUT data sending to api (apiclient): ", data);
    }

    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit) {
    if (process.env.NODE_ENV !== "production") {
      console.log("DELETE data sending to api: ", endpoint);
    }

    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
