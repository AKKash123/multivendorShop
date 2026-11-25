import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { status: "APPROVED", vendor: { status: "APPROVED" } },
      include: { vendor: { select: { storeName: true } } },
      orderBy: { createdAt: "desc" }
    });
  } catch {}
  return <main className="container" style={{ padding: "36px 0" }}>
    <Link href="/" className="muted">← Back to marketplace</Link>
    <h1 className="section-title" style={{ marginTop: 18 }}>All products</h1>
    <p className="muted">Browse approved products from marketplace sellers.</p>
    {products.length ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginTop: 24 }}>
      {products.map(p=><article className="card" key={p.id} style={{ padding: 16 }}><img src={p.imageUrl || ""} alt={p.name} style={{ width:"100%",height:180,objectFit:"cover",borderRadius:12 }}/><p className="muted">{p.vendor.storeName}</p><h3>{p.name}</h3><b>{formatINR(p.pricePaise)}</b><p><Link className="btn" href={`/products/${p.id}`}>View product</Link></p></article>)}
    </div> : <div className="card" style={{ padding: 28, marginTop: 22 }}><h3>Catalogue is getting ready</h3><p className="muted">Approved products will appear here once vendors add their listings.</p></div>}
  </main>;
}
