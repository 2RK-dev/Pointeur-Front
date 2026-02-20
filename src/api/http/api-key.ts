import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";
import { IApiKeyResponse, IApiKeyResponseWithRawToken, ICreateApiKey } from "@/api/types";

export async function createApiKey (data: ICreateApiKey): Promise<IApiKeyResponseWithRawToken> {
    const {data: responseData} = await http.pub.post("/api-keys", data);
    return DTO.ApiKeyResponseWithRawTokenSchema.parse(responseData);
}

export async function getAllApiKeys (): Promise<IApiKeyResponse[]> {
    const {data: responseData} = await http.pub.get("/api-keys");
    return DTO.ApiKeyResponseSchema.array().parse(responseData);
}

export async function deleteApiKey (id: number): Promise<void> {
    await http.pub.delete(`/api-keys/${id}`);
}