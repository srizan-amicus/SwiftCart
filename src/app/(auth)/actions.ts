"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

export interface AuthActionState {
  error: string | null;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function getSafeReturnUrl(value: FormDataEntryValue | null): string {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\")
  ) {
    return value;
  }

  return "/products";
}

async function getErrorMessage(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "The request could not be completed. Please try again.";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const returnTo = getSafeReturnUrl(formData.get("returnTo"));

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return { error: "Please enter your email and password." };
  }

  if (!API_BASE_URL) {
    return { error: "Backend API URL is not configured." };
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
      cache: "no-store",
    });
  } catch {
    return { error: "Unable to connect to the authentication service." };
  }

  if (!response.ok) {
    return { error: await getErrorMessage(response) };
  }

  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data !== "object" ||
    data === null ||
    !("token" in data) ||
    !("refreshToken" in data) ||
    !("name" in data) ||
    !("role" in data) ||
    typeof data.token !== "string" ||
    typeof data.refreshToken !== "string" ||
    typeof data.name !== "string" ||
    typeof data.role !== "string" ||
    !data.token ||
    !data.refreshToken ||
    !data.role.trim()
  ) {
    return { error: "The backend returned an invalid login response." };
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60,
  });

  cookieStore.set("refreshToken", data.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("userName", data.name, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("userEmail", email.trim(), {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("userRole", data.role, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60,
  });

  redirect(returnTo);
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return { error: "Please complete all fields." };
  }

  if (!API_BASE_URL) {
    return { error: "Backend API URL is not configured." };
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
      cache: "no-store",
    });
  } catch {
    return { error: "Unable to connect to the authentication service." };
  }

  if (!response.ok) {
    return { error: await getErrorMessage(response) };
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userName");
  cookieStore.delete("userRole");
  cookieStore.delete("userEmail");

  redirect("/login");
}
