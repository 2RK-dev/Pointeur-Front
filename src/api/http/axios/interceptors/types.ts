import { AxiosInstance } from "axios";

export interface HttpClientInterceptor {
    apply(client: AxiosInstance): void;
}