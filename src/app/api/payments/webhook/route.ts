import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(signature);
  if (a.length !== b.length || !timingSafeEqual(a,b)) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  const event = JSON.parse(rawBody) as { event?: string };
  // TODO: persist provider event ID and process idempotently in a DB transaction.
  return NextResponse.json({ received: true, event: event.event ?? "unknown" });
}
