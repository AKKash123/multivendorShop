import Link from "next/link";
import { requireDemoRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function AdminDashboard() {
  await requireDemoRole(["ADMIN"]);
  let vendors = 0, products = 0, orders = 0;
  try {
    [vendors,products,orders] = await Promise.all([prisma.vendor.count(),prisma.product.count(),prisma.order.count()]);
  } catch {}
  const stats = [["Vendors",vendors],["Products",products],["Orders",orders],["Marketplace status","Preview"]];
  return <main className="container" style={{padding:"36px 0"}}>
    <Link href="/" className="muted">← Marketplace</Link><h1 className="section-title" style={{marginTop:16}}>Marketplace administration</h1><p className="muted">Platform overview and operational controls.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginTop:24}}>{stats.map(([a,b])=><div className="card" key={String(a)} style={{padding:20}}><p className="muted">{a}</p><h2 style={{fontSize:30,margin:0}}>{b}</h2></div>)}</div>
    <div className="card" style={{padding:22,marginTop:20}}><h3>Administration modules</h3><div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{["Vendor approvals","Product moderation","Orders","Payments","Commissions","Refunds","Settlements","Reports"].map(x=><span className="pill" key={x}>{x}</span>)}</div><p className="muted" style={{fontSize:13,marginTop:18}}>Production admin actions must be implemented with explicit permissions, audit logging and server-side validation.</p></div>
  </main>;
}
