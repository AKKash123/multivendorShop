import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ verified: false, error: "Invalid payment verification payload" }, { status: 400 });
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ verified: false, error: "Payment gateway not configured" }, { status: 503 });
  const expected = createHmac("sha256", secret).update(`${parsed.data.razorpay_order_id}|${parsed.data.razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parsed.data.razorpay_signature);
  const verified = a.length === b.length && timingSafeEqual(a,b);
  // A verified signature is not, by itself, a complete order lifecycle.
  // Persist the payment, reconcile webhooks and update the matching order transactionally.
  return NextResponse.json({ verified });
}
