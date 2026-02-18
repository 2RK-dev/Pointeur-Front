import { http } from "@/api/http/axios";
import axios from "axios";
import { DTO } from "@/api/schemas";
import { ILoginRequest, ILoginResponse, IPasswordChange } from "@/api/types";

export async function login(data: ILoginRequest): Promise<ILoginResponse> {
    try {
        const response = await http.pub.post("/auth/login", data);
        const loginResponse = DTO.LoginResponseSchema.parse(response.data);
        await http.setAccessToken(loginResponse.access_token);
        return loginResponse;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status == 401) {
            console.info("Login failed: Bad credentials")
            throw new Error("BAD_CREDENTIALS");
        } else throw e;
    }
}

export async function logout (): Promise<void> {
    await http.pub.post("/auth/logout");
    await http.setAccessToken(null);
}

export async function changePassword (data: IPasswordChange): Promise<void> {
    await http.pub.put("/auth/password", data);
}