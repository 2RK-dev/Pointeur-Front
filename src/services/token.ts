"use server";

import {ApiToken, ApiTokenResponse} from "@/Types/token";

const MOCK_TOKENS: ApiToken[] = [
    { id: "1", name: "Serveur Staging", prefix: "2RK_Api_", createdAt: new Date("2023-10-01") },
    { id: "2", name: "Intégration Zapier", prefix: "2RK_Api_", createdAt: new Date("2024-01-15") },
];

const mockCreateTokenService = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`;
};

export async function getAllTokens():Promise<ApiToken[]> {
    //TODO: implement logic
    return MOCK_TOKENS;
}

export async function createNewTokens(name:string):Promise<ApiTokenResponse> {
    //TODO: implement logic
    const token = await mockCreateTokenService();
    const newToken: ApiTokenResponse = {
        id: (MOCK_TOKENS.length + 1).toString(),
        name,
        prefix: "2rk_api_",
        createdAt: new Date(),
        token,
    };
    MOCK_TOKENS.unshift(newToken);
    return newToken;
}

export async function deleteToken(tokenId:string) {
    //TODO: implement logic
    const index = MOCK_TOKENS.findIndex((token) => token.id === tokenId);
    if (index !== -1) {
        MOCK_TOKENS.splice(index, 1);
    } else {
        throw new Error("Token not found");
    }
}
