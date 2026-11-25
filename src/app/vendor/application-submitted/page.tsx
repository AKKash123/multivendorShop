import Link from "next/link";
export default function Submitted() {
  return <main className="container" style={{padding:"80px 0"}}><div className="card" style={{maxWidth:620,padding:32,margin:"auto"}}><span className="pill">APPLICATION RECEIVED</span><h1>Thanks for applying.</h1><p className="muted">Your vendor application is pending admin review. Account approval and KYC checks are required before products can be published.</p><Link href="/" className="btn">Back to marketplace</Link></div></main>;
}
