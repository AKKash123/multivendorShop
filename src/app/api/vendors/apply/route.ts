import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  ownerName: z.string().min(2),
  email: z.email(),
  storeName: z.string().min(2),
  description: z.string().max(1000).optional()
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const parsed = schema.safeParse({
    ownerName: form.get("ownerName"),
    email: form.get("email"),
    storeName: form.get("storeName"),
    description: form.get("description") || undefined
  });
  if (!parsed.success) return NextResponse.json({ error: "Please check the submitted fields." }, { status: 400 });
  const { ownerName, email, storeName, description } = parsed.data;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.vendor) return NextResponse.json({ error: "A vendor application already exists for this email." }, { status: 409 });
    const user = existing ?? await prisma.user.create({ data: { name: ownerName, email, role: "VENDOR" } });
    const baseSlug = slugify(storeName);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2,7)}`;
    await prisma.vendor.create({ data: { userId: user.id, storeName, slug, description, status: "PENDING" } });
    return NextResponse.redirect(new URL("/vendor/application-submitted", request.url));
  } catch {
    return NextResponse.json({ error: "Database unavailable or application could not be saved. Configure PostgreSQL and run migrations." }, { status: 503 });
  }
}
