"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, createAdminSession, terminateAdminSession } from "@/utils/auth";

export type AuthActionState = {
  error?: string;
  success?: boolean;
};

/** Authenticates admin user with table-based credentials and bcrypt verification. */
export async function loginAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const username = formData.get("username")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!username.trim() || !password.trim()) {
    return { error: "Please provide both username and password." };
  }

  const result = await authenticateAdmin(username, password);

  if ("error" in result) {
    return { error: result.error };
  }

  await createAdminSession(result.user);
  redirect("/manage");
}

/** Signs out administrator and redirects to /login. */
export async function logoutAction(): Promise<void> {
  await terminateAdminSession();
  redirect("/login");
}
