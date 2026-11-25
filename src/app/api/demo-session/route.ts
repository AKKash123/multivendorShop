import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const role = String(data.get("role") || "CUSTOMER");
  if (!["CUSTOMER","VENDOR","ADMIN"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  const response = NextResponse.redirect(new URL(role === "ADMIN" ? "/admin/dashboard" : role === "VENDOR" ? "/vendor/dashboard" : "/", request.url));
  response.cookies.set("demo-role", role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  return response;
}
