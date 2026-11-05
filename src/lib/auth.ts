
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export interface AuthSession {
  isLoggedIn: boolean;
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value ?? null;
}

export async function getAuthSession(): Promise<AuthSession> {
  const accessToken = await getAccessToken();

  return {
    isLoggedIn: Boolean(accessToken),
  };
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken || !API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !("token" in data) ||
      !("refreshToken" in data) ||
      typeof data.token !== "string" ||
      typeof data.refreshToken !== "string"
    ) {
      return null;
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

    return data.token;
  } catch {
    return null;
  }
}

export function clearAuthCookies(response: NextResponse): void {
  const cookieNames = ["accessToken", "refreshToken"];

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });
  }
}
