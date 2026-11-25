"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [role,setRole] = useState("CUSTOMER");
  return <main className="container" style={{padding:"60px 0"}}>
    <div className="card" style={{maxWidth:460,margin:"auto",padding:28}}>
      <Link href="/" className="muted">← Marketplace</Link><h1>Welcome back</h1><p className="muted">Development preview role switch. Replace with Firebase sign-in and verified server sessions before production.</p>
      <label>Preview portal</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="CUSTOMER">Customer</option><option value="VENDOR">Vendor</option><option value="ADMIN">Admin</option></select>
      <form action="/api/demo-session" method="post" style={{marginTop:18}}><input type="hidden" name="role" value={role}/><button className="btn" style={{width:"100%"}}>Continue to preview</button></form>
    </div>
  </main>;
}
