import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "APPROVED", vendor: { status: "APPROVED" } },
      include: { vendor: { select: { storeName: true } }, category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
