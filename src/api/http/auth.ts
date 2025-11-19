import { http } from "@/api/http/axios";
import axios from "axios";
import { DTO } from "@/api/schemas";
import { ILoginRequest, ILoginResponse } from "@/api/types";

export async function login(data: ILoginRequest): Promise<ILoginResponse> {
    try {
        const {data: responseData} = await http.pub.post("/auth/login", data);
        return DTO.LoginResponseSchema.parse(responseData);
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status == 401) {
            console.info("Login failed: Bad credentials")
            throw new Error("BAD_CREDENTIALS");
        } else throw e;
    }
}

export async function logout (): Promise<void> {
    await http.pub.post("/auth/logout");
}