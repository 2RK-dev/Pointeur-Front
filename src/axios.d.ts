import 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        is_a_retry?: boolean;
    }
}
