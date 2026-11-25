import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay } from "@/lib/razorpay";

const schema = z.object({ amountPaise: z.number().int().positive().max(10_000_000) });

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  // IMPORTANT: This endpoint is a gateway integration example only.
  // Production checkout must derive amount from a server-validated cart/order,
  // authenticate the customer, persist the pending order and enforce stock checks.
  try {
    const order = await getRazorpay().orders.create({
      amount: parsed.data.amountPaise,
      currency: "INR",
      receipt: `preview_${Date.now()}`
    });
    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID });
  } catch {
    return NextResponse.json({ error: "Razorpay is not configured or order creation failed." }, { status: 503 });
  }
}
