import Link from "next/link";
import { requireDemoRole } from "@/lib/auth";
export default async function VendorDashboard() {
  await requireDemoRole(["VENDOR","ADMIN"]);
  return <main className="container" style={{padding:"36px 0"}}>
    <Link href="/" className="muted">← Marketplace</Link><h1 className="section-title" style={{marginTop:16}}>Vendor workspace</h1><p className="muted">Manage your store operations from one place.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:16,marginTop:24}}>
      {[["Products","Create listings and manage stock"],["Orders","Review and fulfil vendor orders"],["Earnings","View commissions and payable balance"],["Settlements","Track payout status"],["KYC profile","Submit business verification"]].map(([a,b])=><div className="card" key={a} style={{padding:20}}><h3>{a}</h3><p className="muted" style={{fontSize:13}}>{b}</p><span className="pill">Module scaffold</span></div>)}
    </div>
  </main>;
}
