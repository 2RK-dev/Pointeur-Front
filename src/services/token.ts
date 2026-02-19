"use server";

import { ApiToken, ApiTokenResponse } from "@/Types/token";
import { createApiKey, deleteApiKey, getAllApiKeys } from "@/api/http/api-key";
import { ApiTokenMapper } from "@/services/mapper";

export async function getAllTokens():Promise<ApiToken[]> {
    const apiKeysList = await getAllApiKeys();
    return apiKeysList.map(k => ApiTokenMapper.fromDto(k));
}

export async function createNewTokens(name:string):Promise<ApiTokenResponse> {
    const created = await createApiKey({name});
    return ApiTokenMapper.fromDtoWithRawToken(created);
}

export async function deleteToken(tokenId:string) {
    await deleteApiKey(parseInt(tokenId));
}
