import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  customerId: z.string().min(1),
  paymentMethod: z.enum(["RAZORPAY","COD"]),
  addressName: z.string().min(2),
  addressLine: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive().max(20) })).min(1)
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid order details" }, { status: 400 });

  // This starter route deliberately does not create an order: it lacks a
  // production authentication/session adapter. Never accept customerId or
  // price totals as trusted identity/price inputs from the browser.
  return NextResponse.json({
    error: "Checkout API scaffolded. Connect verified server session, server-side cart pricing, stock reservation and transactional order creation before enabling orders."
  }, { status: 501 });
}
