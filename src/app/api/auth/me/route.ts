import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const role = request.cookies.get("userRole")?.value;

  return NextResponse.json(
    {
      isAdmin: role?.toLowerCase() === "admin",
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
