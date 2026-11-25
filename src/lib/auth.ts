import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Demo identity adapter. Replace with Firebase ID-token verification and a
 * server-managed, HTTP-only session before production. Never trust a role
 * supplied by a client request.
 */
export async function getDemoRole() {
  const jar = await cookies();
  return jar.get("demo-role")?.value ?? "CUSTOMER";
}

export async function requireDemoRole(allowed: string[]) {
  const role = await getDemoRole();
  if (!allowed.includes(role)) redirect("/login");
  return role;
}
