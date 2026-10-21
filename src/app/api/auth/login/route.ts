import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.DOTNET_API_BASE_URL?.replace(/\/+$/, "");

interface LoginResponse {
  token: string;
  refreshToken: string;
  customerId: number;
  name: string;
  role: string;
}

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      !body.email.trim() ||
      !body.password
    ) {
      return NextResponse.json(
        { message: "A valid email and password are required." },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password,
      }),
      cache: "no-store",
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Login failed. Check your credentials and try again." },
        { status: response.status === 401 ? 401 : response.status },
      );
    }

    if (
      typeof data !== "object" ||
      data === null ||
      !("token" in data) ||
      !("refreshToken" in data) ||
      !("customerId" in data) ||
      !("name" in data) ||
      !("role" in data) ||
      typeof data.token !== "string" ||
      typeof data.refreshToken !== "string" ||
      typeof data.customerId !== "number" ||
      typeof data.name !== "string" ||
      typeof data.role !== "string" ||
      !data.token ||
      !data.refreshToken ||
      !data.role.trim()
    ) {
      return NextResponse.json(
        { message: "The backend returned an invalid login response." },
        { status: 502 },
      );
    }

    const loginData = data as LoginResponse;

    const result = NextResponse.json({
      customerId: loginData.customerId,
      name: loginData.name,
      role: loginData.role,
    });

    const secure = process.env.NODE_ENV === "production";

    result.cookies.set("accessToken", loginData.token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    result.cookies.set("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    result.cookies.set("userRole", loginData.role, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return result;
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the authentication service." },
      { status: 502 },
    );
  }
}
