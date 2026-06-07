"use server";

import { changePassword } from "@/api/http/auth";

export async function changeProfilePasswordService(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    await changePassword({old: currentPassword, new: newPassword, confirm: newPassword});
}