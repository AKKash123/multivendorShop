import Link from "next/link";
export default function VendorRegisterPage() {
  return <main className="container" style={{padding:"40px 0"}}>
    <Link href="/" className="muted">← Marketplace</Link>
    <div className="card" style={{maxWidth:700,padding:28,margin:"20px auto"}}>
      <span className="pill">SELL ON MARKETPLACE</span><h1 className="section-title" style={{marginTop:14}}>Become a vendor</h1>
      <p className="muted">Submit your store details for admin review. KYC verification and vendor account activation must be completed before selling.</p>
      <form action="/api/vendors/apply" method="post" style={{display:"grid",gap:14}}>
        <div><label>Owner name</label><input name="ownerName" required placeholder="Your full name"/></div>
        <div><label>Email</label><input name="email" type="email" required placeholder="you@example.com"/></div>
        <div><label>Store name</label><input name="storeName" required placeholder="Your store"/></div>
        <div><label>Store description</label><textarea name="description" rows={3} placeholder="Tell customers about your store"/></div>
        <button className="btn">Submit vendor application</button>
      </form>
    </div>
  </main>;
}
