import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/money";

export default async function ProductDetail({ params }: { params: Promise<{id:string}> }) {
  const { id } = await params;
  let product: any = null;
  try { product = await prisma.product.findUnique({ where: { id }, include: { vendor: true, category: true } }); } catch {}
  if (!product) notFound();
  return <main className="container" style={{ padding: "36px 0" }}>
    <Link href="/products" className="muted">← Products</Link>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:32,marginTop:22 }}>
      <img src={product.imageUrl || ""} alt={product.name} style={{ width:"100%",maxHeight:480,objectFit:"cover",borderRadius:20 }}/>
      <div><span className="pill">{product.category?.name || "Marketplace"}</span><h1 style={{fontSize:38,letterSpacing:-1}}>{product.name}</h1><p className="muted">Sold by {product.vendor.storeName}</p><h2>{formatINR(product.pricePaise)}</h2><p style={{lineHeight:1.8}}>{product.description}</p><p className="muted">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p><Link href="/cart" className="btn">Continue to cart</Link><p className="muted" style={{fontSize:12}}>Cart persistence and full checkout are part of the next implementation phase.</p></div>
    </div>
  </main>;
}
