"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  getIdToken,
  type Auth,
  type User,
} from "firebase/auth";

// Firebase init (module scope, browser-only). Reads NEXT_PUBLIC_FIREBASE_* env vars.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const firebaseReady = Boolean(firebaseConfig.apiKey);
let auth: Auth | null = null;
if (firebaseReady && typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ProviderDef = {
  id: "google" | "facebook" | "github" | "twitter" | "apple";
  label: string;
  make: () =>
    | GoogleAuthProvider
    | FacebookAuthProvider
    | GithubAuthProvider
    | TwitterAuthProvider
    | OAuthProvider;
};

const PROVIDERS: ProviderDef[] = [
  { id: "google", label: "Google", make: () => new GoogleAuthProvider() },
  { id: "facebook", label: "Facebook", make: () => new FacebookAuthProvider() },
  { id: "github", label: "GitHub", make: () => new GithubAuthProvider() },
  { id: "twitter", label: "X", make: () => new TwitterAuthProvider() },
  { id: "apple", label: "Apple", make: () => new OAuthProvider("apple.com") },
];

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const message = (err as { message?: string })?.message ?? "";
  const map: Record<string, string> = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found for that email. Try creating one.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/missing-password": "Please enter your password.",
    "auth/email-already-in-use": "An account already exists with this email. Try signing in.",
    "auth/weak-password": "Choose a stronger password (at least 6 characters).",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in your Firebase project.",
    "auth/popup-closed-by-user": "The sign-in window was closed before finishing.",
    "auth/cancelled-popup-request": "Sign-in was cancelled.",
    "auth/popup-blocked": "Popup blocked — trying redirect sign-in…",
    "auth/network-request-failed": "Network problem. Check your connection.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/unauthorized-domain": "This domain isn't authorised in Firebase Auth settings.",
    "auth/account-exists-with-different-credential": "An account exists with this email via a different method.",
  };
  return map[code] || message || "Something went wrong. Please try again.";
}

function initials(name?: string | null, email?: string | null): string {
  const base = (name || email || "?").trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function providerLabel(u: User): string {
  const pid = u.providerData?.[0]?.providerId;
  if (!pid || pid === "password") return "Email";
  return pid.replace(".com", "");
}

function SocialIcon({ id }: { id: ProviderDef["id"] }) {
  switch (id) {
    case "google":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2.2 12 2.2 6.9 2.2 2.8 6.3 2.8 11.4S6.9 20.6 12 20.6c5.7 0 9.5-4 9.5-9.6 0-.65-.07-1.1-.16-1.6H12Z" /></svg>);
    case "facebook":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.24 2.7.24v3h-1.5c-1.5 0-1.9.93-1.9 1.88V12h3.3l-.53 3.5h-2.8v8.4A12 12 0 0 0 24 12Z" /></svg>);
    case "github":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#181717" d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.52.1.71-.23.71-.5v-2c-2.9.63-3.5-1.25-3.5-1.25-.47-1.2-1.15-1.52-1.15-1.52-.94-.64.07-.63.07-.63 1.04.07 1.59 1.07 1.59 1.07.93 1.6 2.43 1.13 3.02.86.1-.67.36-1.13.66-1.39-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.88 1.08a10 10 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.46.21 2.53.1 2.8.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.71.97.71 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5Z" /></svg>);
    case "twitter":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#000" d="M18.9 2H22l-7.3 8.34L23.2 22h-6.8l-5.3-6.93L4.8 22H1.7l7.8-8.9L1 2h6.95l4.8 6.34L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4l12.3 16.1Z" /></svg>);
    case "apple":
      return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#000" d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85-.74 0-1.85-.83-3.05-.81-1.57.02-3.02.91-3.83 2.32-1.64 2.85-.42 7.06 1.18 9.36.78 1.13 1.71 2.4 2.93 2.35 1.18-.05 1.62-.76 3.05-.76 1.41 0 1.83.76 3.07.74 1.27-.02 2.07-1.15 2.84-2.28.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.47-.95-2.49-3.77ZM14.2 5.9c.65-.79 1.09-1.88.97-2.97-.94.04-2.07.63-2.74 1.41-.6.69-1.13 1.8-.99 2.87 1.05.08 2.12-.53 2.76-1.31Z" /></svg>);
  }
}

const AUTH_STYLES = `
.auth-seg{display:grid;grid-template-columns:1fr 1fr;background:#eef1ee;border:1px solid #e5e9ed;border-radius:10px;padding:4px;gap:4px;margin:14px 0 16px}
.auth-seg button{appearance:none;border:0;background:transparent;padding:9px;border-radius:7px;font-size:14px;font-weight:600;color:#828e9c;cursor:pointer;font-family:inherit}
.auth-seg button.active{background:#fff;color:#16202b;box-shadow:0 6px 16px -8px rgba(16,32,43,.18)}
.auth-banner{padding:10px 12px;border-radius:8px;font-size:13px;line-height:1.45;margin-bottom:14px;border:1px solid transparent}
.auth-banner.error{background:#fef2f2;color:#dc2626;border-color:#fecaca}
.auth-banner.success{background:#ecfdf5;color:#047857;border-color:#a7f3d0}
.auth-notice{background:#fffbeb;color:#92400e;border:1px solid #fde68a;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:14px;line-height:1.5}
.auth-notice code{background:rgba(146,64,14,.12);padding:1px 4px;border-radius:4px}
.auth-social{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}
.auth-social-btn{display:flex;align-items:center;justify-content:center;gap:8px;height:44px;border:1px solid #d6dce2;background:#fff;border-radius:9px;font-size:14px;font-weight:600;color:#44515f;cursor:pointer;font-family:inherit}
.auth-social-btn:hover:not(:disabled){border-color:#10b981}
.auth-social-btn:disabled{opacity:.55;cursor:not-allowed}
.auth-social-btn svg{width:18px;height:18px;flex-shrink:0}
.auth-divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:#828e9c;font-size:12px}
.auth-divider::before,.auth-divider::after{content:"";flex:1;height:1px;background:#e5e9ed}
.auth-field{margin-bottom:13px}
.auth-field label{display:block;font-size:13px;font-weight:600;color:#44515f;margin-bottom:6px}
.auth-field input{width:100%;height:44px;padding:0 12px;border:1px solid #d6dce2;border-radius:9px;font-size:15px;color:#16202b;background:#fff;font-family:inherit;box-sizing:border-box}
.auth-field input:focus{outline:none;border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.14)}
.auth-field.invalid input{border-color:#dc2626}
.auth-field-err{display:none;font-size:12px;color:#dc2626;margin-top:5px}
.auth-field.invalid .auth-field-err{display:block}
.auth-input-row{position:relative;display:flex;align-items:center}
.auth-input-row input{padding-right:62px}
.auth-pw-toggle{position:absolute;right:6px;border:0;background:transparent;height:34px;padding:0 8px;border-radius:7px;font-size:12px;font-weight:600;color:#828e9c;cursor:pointer;font-family:inherit}
.auth-pw-toggle:hover{background:#eef1ee;color:#44515f}
.auth-link{background:transparent;border:0;font-size:13px;color:#44515f;cursor:pointer;font-family:inherit;padding:0}
.auth-link:hover{color:#047857}
.auth-avatar{width:68px;height:68px;border-radius:50%;margin:6px auto 10px;background:#ecfdf5;color:#047857;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;overflow:hidden;border:2px solid #10b981}
.auth-avatar img{width:100%;height:100%;object-fit:cover}
.auth-chip{display:inline-flex;align-items:center;gap:6px;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;border-radius:999px;padding:5px 11px;font-size:12px;font-weight:600;text-transform:capitalize;margin-bottom:16px}
.auth-ghost{background:transparent !important;color:#44515f !important;border:1px solid #d6dce2}
@media(max-width:420px){.auth-social{grid-template-columns:1fr}}
`;

export default function LoginPage() {
  const [role,setRole] = useState("CUSTOMER");
  const [mode,setMode] = useState<"signin"|"signup">("signin");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [showPw,setShowPw] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState<string|null>(null);
  const [info,setInfo] = useState<string|null>(null);
  const [invalid,setInvalid] = useState<Record<string,boolean>>({});
  const [user,setUser] = useState<User|null>(null);
  const [idToken,setIdToken] = useState<string|null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u); setIdToken(null); setError(null); setInfo(null);
      if (u) { try { setIdToken(await getIdToken(u, true)); } catch { setIdToken(null); } }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then((res) => { if (res?.user) { /* handled by onAuthStateChanged */ } })
      .catch((err) => setError(friendlyError(err)));
  }, []);

  function validate(): boolean {
    const next: Record<string, boolean> = {};
    if (mode === "signup") {
      if (!name.trim()) next.name = true;
      if (confirm !== password) next.confirm = true;
    }
    if (!EMAIL_RE.test(email.trim())) next.email = true;
    if (password.length < 6) next.password = true;
    setInvalid(next);
    return Object.keys(next).length === 0;
  }

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    if (!auth) { setError("Firebase isn't configured. Set NEXT_PUBLIC_FIREBASE_* env vars."); return; }
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSocial(id: ProviderDef["id"]) {
    setError(null); setInfo(null);
    if (!auth) { setError("Firebase isn't configured. Set NEXT_PUBLIC_FIREBASE_* env vars."); return; }
    const def = PROVIDERS.find((p) => p.id === id);
    if (!def) return;
    const provider = def.make();
    if (id === "google") provider.setCustomParameters({ prompt: "select_account" });
    setBusy(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      if ((err as { code?: string })?.code === "auth/popup-blocked") {
        try { await signInWithRedirect(auth, provider); return; }
        catch (e) { setError(friendlyError(e)); }
      } else {
        setError(friendlyError(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function onForgot() {
    setError(null); setInfo(null);
    if (!auth) { setError("Firebase isn't configured."); return; }
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid({ email: true });
      setError("Enter your email above first, then tap “Forgot password?”.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  async function onSignOut() {
    if (!auth) return;
    try { await signOut(auth); } catch (err) { setError(friendlyError(err)); }
  }

  function switchMode(next: "signin"|"signup") {
    setMode(next); setInvalid({}); setError(null); setInfo(null);
  }

  return <main className="container" style={{padding:"60px 0"}}>
    {user ? (
      <div className="card" style={{maxWidth:460,margin:"auto",padding:28}}>
        <Link href="/" className="muted">← Marketplace</Link>
        <div className="auth-avatar">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span>{initials(user.displayName, user.email)}</span>
          )}
        </div>
        <h1>{user.displayName ? `Hi, ${user.displayName.split(" ")[0]}` : "Welcome back"}</h1>
        <p className="muted">{user.email}</p>
        <span className="auth-chip">Signed in via {providerLabel(user)}</span>
        <label>Preview portal</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="CUSTOMER">Customer</option>
          <option value="VENDOR">Vendor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <form action="/api/demo-session" method="post" style={{marginTop:18}}>
          <input type="hidden" name="role" value={role}/>
          <input type="hidden" name="idToken" value={idToken ?? ""}/>
          <button className="btn" style={{width:"100%"}} disabled={!idToken}>
            {idToken ? "Continue to preview" : "Preparing session…"}
          </button>
        </form>
        <button className="btn auth-ghost" style={{width:"100%",marginTop:10}} onClick={onSignOut}>Sign out</button>
      </div>
    ) : (
      <div className="card" style={{maxWidth:460,margin:"auto",padding:28}}>
        <Link href="/" className="muted">← Marketplace</Link>
        <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">{mode === "signup" ? "Join Shopezzy with email or a social account." : "Sign in with email or a social account to continue."}</p>

        {!firebaseReady && (
          <p className="auth-notice">Firebase env vars are not set. Add <code>NEXT_PUBLIC_FIREBASE_*</code> to enable real sign-in.</p>
        )}

        <div className="auth-seg" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => switchMode("signin")}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Create account</button>
        </div>

        {error && <div className="auth-banner error" role="alert">{error}</div>}
        {info && <div className="auth-banner success" role="status">{info}</div>}

        <div className="auth-social">
          {PROVIDERS.map((p) => (
            <button key={p.id} type="button" className="auth-social-btn" disabled={busy} onClick={() => onSocial(p.id)}>
              <SocialIcon id={p.id} /> {p.label}
            </button>
          ))}
        </div>

        <div className="auth-divider"><span>or use email</span></div>

        <form onSubmit={onEmailSubmit} noValidate>
          {mode === "signup" && (
            <div className={`auth-field ${invalid.name ? "invalid" : ""}`}>
              <label htmlFor="name">Full name</label>
              <input id="name" type="text" autoComplete="name" placeholder="Aarav Mehta" value={name} onChange={e=>setName(e.target.value)} />
              <span className="auth-field-err">Please enter your name.</span>
            </div>
          )}
          <div className={`auth-field ${invalid.email ? "invalid" : ""}`}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <span className="auth-field-err">Enter a valid email address.</span>
          </div>
          <div className={`auth-field ${invalid.password ? "invalid" : ""}`}>
            <label htmlFor="password">Password</label>
            <div className="auth-input-row">
              <input id="password" type={showPw ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="At least 6 characters" value={password} onChange={e=>setPassword(e.target.value)} />
              <button type="button" className="auth-pw-toggle" onClick={()=>setShowPw(s=>!s)} aria-label={showPw ? "Hide password" : "Show password"}>{showPw ? "Hide" : "Show"}</button>
            </div>
            <span className="auth-field-err">Password must be at least 6 characters.</span>
          </div>
          {mode === "signup" && (
            <div className={`auth-field ${invalid.confirm ? "invalid" : ""}`}>
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" type={showPw ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
              <span className="auth-field-err">Passwords do not match.</span>
            </div>
          )}
          {mode === "signin" && (
            <div style={{textAlign:"right",marginBottom:12}}>
              <button type="button" className="auth-link" onClick={onForgot}>Forgot password?</button>
            </div>
          )}
          <button type="submit" className="btn" style={{width:"100%"}} disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="muted" style={{marginTop:14,fontSize:12,textAlign:"center"}}>By continuing you agree to Shopezzy's Terms and Privacy Policy.</p>
      </div>
    )}
    <style dangerouslySetInnerHTML={{ __html: AUTH_STYLES }} />
  </main>;
}