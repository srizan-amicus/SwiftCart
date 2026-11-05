
import { NextResponse } from "next/server";
import { getCartItemCount } from "@/services/cart-api";

export async function GET() {
  try {
    const itemCount = await getCartItemCount();

    return NextResponse.json(
      { itemCount },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch cart count:", error);

    return NextResponse.json(
      { message: "Unable to fetch cart count." },
      { status: 500 },
    );
  }
}
