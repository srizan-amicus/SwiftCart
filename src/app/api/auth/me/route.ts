
import { NextResponse } from "next/server";

const DEMO_USER_ROLE = "Customer";

export async function GET() {
  return NextResponse.json(
    {
      isAdmin: DEMO_USER_ROLE.toLowerCase() === "admin",
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
