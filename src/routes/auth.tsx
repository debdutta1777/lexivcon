import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import seal from "@/assets/lexicon-seal.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Lexicon" },
      { name: "description", content: "Sign in to your private Lexicon legal workspace." },
      { property: "og:title", content: "Sign in | Lexicon" },
      { property: "og:description", content: "Sign in to your private Lexicon legal workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) void navigate({ to: "/cases" });
    });
    return () => { mounted = false; };
  }, [navigate]);

  const handlePasswordAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then come back to sign in.");
    } else {
      await navigate({ to: "/cases" });
    }
    setBusy(false);
  };

  const handleGoogle = async () => {
    setBusy(true);
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setMessage(result.error.message);
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3 text-primary-foreground"><img src={seal} alt="Lexicon seal" className="size-9 object-contain" /><span className="font-serif text-xl">lexicon</span></Link>
        <div className="max-w-md"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">A calmer read of the fine print</p><h1 className="font-serif text-6xl leading-[0.98]">Your questions belong in one place.</h1><p className="mt-6 leading-7 text-primary-foreground/75">Save each document or legal question as its own private case. Come back to the details when you’re ready.</p></div>
        <p className="text-sm text-primary-foreground/60">Information and preparation, not a substitute for legal advice.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden"><ArrowLeft className="size-4" /> Back to Lexicon</Link>
          <div className="mb-9"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary lg:hidden"><img src={seal} alt="" className="size-8 object-contain" /></div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Private legal workspace</p><h2 className="mt-3 font-serif text-4xl">{mode === "sign-in" ? "Welcome back." : "Start with clarity."}</h2><p className="mt-3 text-muted-foreground">{mode === "sign-in" ? "Pick up where you left off." : "Create a secure place for your documents and questions."}</p></div>
          <form onSubmit={handlePasswordAuth} className="space-y-4">
            <label className="block text-sm font-medium">Email<input className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
            <label className="block text-sm font-medium">Password<input className="mt-2 flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" minLength={6} required /></label>
            <Button type="submit" className="h-11 w-full rounded-lg" disabled={busy}>{mode === "sign-in" ? "Sign in" : "Create account"}<ArrowRight className="size-4" /></Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
          <Button type="button" variant="outline" className="h-11 w-full rounded-lg" onClick={handleGoogle} disabled={busy}><span className="font-semibold">G</span> Continue with Google</Button>
          {message && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{message}</p>}
          <p className="mt-7 text-center text-sm text-muted-foreground">{mode === "sign-in" ? "New to Lexicon?" : "Already have an account?"}{" "}<button type="button" className="font-semibold text-foreground underline underline-offset-4" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(null); }}>{mode === "sign-in" ? "Create an account" : "Sign in"}</button></p>
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Your cases are visible only to you.</p>
        </div>
      </section>
    </main>
  );
}