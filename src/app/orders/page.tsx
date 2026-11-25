import Link from "next/link";
export default function OrdersPage() {
  return <main className="container" style={{padding:"48px 0"}}><Link href="/" className="muted">← Marketplace</Link><div className="card" style={{padding:28,marginTop:20}}><h1>My orders</h1><p className="muted">Sign in to view order history, payment status and delivery updates.</p><Link href="/login" className="btn">Sign in</Link></div></main>;
}
