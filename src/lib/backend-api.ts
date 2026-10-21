import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  refreshAccessToken,
  clearAuthCookies,
} from "@/lib/auth";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

interface BackendRequestOptions {
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export async function fetchBackend(
  request: NextRequest,
  path: string,
  options: BackendRequestOptions = {},
): Promise<Response> {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured." },
      { status: 500 },
    );
  }

  const sendRequest = async (token: string | null) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body,
      cache: options.cache ?? "no-store",
      signal: request.signal,
    });
  };

  const accessToken = await getAccessToken();
  let response = await sendRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }

  const refreshedToken = await refreshAccessToken();

  if (!refreshedToken) {
    const unauthorized = NextResponse.json(
      { message: "Your session has expired. Please log in again." },
      { status: 401 },
    );

    clearAuthCookies(unauthorized);
    return unauthorized;
  }

  response = await sendRequest(refreshedToken);
  return response;
}
