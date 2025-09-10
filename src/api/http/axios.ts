import axios from "@/lib/axios";

const pub = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export const http = {pub};