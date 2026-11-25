import Link from "next/link";
export default function CartPage() {
  return <main className="container" style={{padding:"50px 0"}}>
    <Link href="/" className="muted">← Continue shopping</Link>
    <div className="card" style={{padding:32,marginTop:20,maxWidth:700}}>
      <h1 className="section-title">Your shopping cart</h1>
      <p className="muted">The cart and checkout UI is scaffolded here. Connect the product selection state and server-side checkout flow before accepting live orders.</p>
      <Link href="/products" className="btn">Browse products</Link>
    </div>
  </main>;
}
