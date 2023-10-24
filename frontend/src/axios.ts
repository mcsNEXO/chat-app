import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
export interface ApiClientOptions {
  baseUrl: string;
}

export class ApiClient {
  private axios: AxiosInstance;

  constructor(private options: ApiClientOptions) {
    this.axios = this.createAxiosInstance();
  }

  private createAxiosInstance() {
    const instance = axios.create({
      baseURL: this.options.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    instance.interceptors.request.use(async (config) => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else if (config.url !== "auth/login" && !accessToken) {
        try {
          const controller = new AbortController();
          const response = await axios.request({
            baseURL: "http://localhost:3002/auth/token",
            method: "get",
            withCredentials: true,
            signal: controller.signal,
          });
          const newAccessToken = response.data.accessToken;
          if (newAccessToken) {
            config.headers.Authorization = `Bearer ${newAccessToken}`;
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
      return config;
    });
    return instance;
  }

  async sendRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await this.axios.request({
      ...config,
      url: config.url,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  }
}

export const apiClient = new ApiClient({
  baseUrl: "http://localhost:3002/",
});
