import z from "zod";

export const LoginRequestSchema = z.object({
    username: z.string(),
    password: z.string(),
});
const UserInfoSchema = z.object({
    username: z.string(),
    role: z.string(),
});
export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    user: UserInfoSchema
});