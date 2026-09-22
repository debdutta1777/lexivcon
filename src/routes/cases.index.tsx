import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileText, LogOut, Plus, Scale, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import seal from "@/assets/lexicon-seal.png";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Your cases | Lexicon" },
      { name: "description", content: "Your private Lexicon legal cases and document workspace." },
      { property: "og:title", content: "Your cases | Lexicon" },
      { property: "og:description", content: "Your private Lexicon legal cases and document workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

type LegalCase = Tables<"legal_cases">;

function CasesPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { await navigate({ to: "/auth" }); return; }
      if (mounted) setEmail(data.session.user.email ?? "");
      const result = await supabase.from("legal_cases").select("*").order("updated_at", { ascending: false });
      if (mounted) { setCases(result.data ?? []); setLoading(false); }
    });
    return () => { mounted = false; };
  }, [navigate]);

  const signOut = async () => { await supabase.auth.signOut(); await navigate({ to: "/" }); };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10"><Link to="/cases" className="flex items-center gap-3"><img src={seal} alt="Lexicon seal" className="size-9 object-contain" /><span className="font-serif text-xl">lexicon</span></Link><div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">{email}</span><Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut className="size-4" /></Button></div></div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><Scale className="size-4" /> Your legal workspace</p><h1 className="mt-3 font-serif text-5xl tracking-tight">Cases</h1><p className="mt-3 max-w-xl text-muted-foreground">Keep each document, question, and next step together.</p></div><Button asChild className="rounded-lg"><Link to="/cases/new"><Plus className="size-4" /> New case</Link></Button></div>
        {loading ? <div className="mt-14 text-sm text-muted-foreground">Loading your private workspace…</div> : cases.length === 0 ? <div className="mt-12 border border-dashed border-border bg-card px-6 py-16 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary"><FileText className="size-6" /></div><h2 className="mt-5 font-serif text-3xl">Start with one document or question.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Create a case, add the relevant text, and Lexicon will help you understand what matters.</p><Button asChild className="mt-7 rounded-lg"><Link to="/cases/new">Create your first case <ArrowRight className="size-4" /></Link></Button></div> : <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{cases.map((legalCase) => <Link key={legalCase.id} to="/cases/$caseId" params={{ caseId: legalCase.id }} className="group border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"><div className="flex items-start justify-between gap-4"><div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary"><FileText className="size-5" /></div><span className="text-xs text-muted-foreground">{new Date(legalCase.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div><h2 className="mt-8 font-serif text-2xl group-hover:text-primary">{legalCase.title}</h2><p className="mt-2 truncate text-sm text-muted-foreground">{legalCase.document_name || "Question-led case"}</p><div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>{legalCase.document_text ? "Document added" : "Ready for context"}</span><ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></div></Link>)}</div>}
        <div className="mt-16 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Private workspace · Legal information, not legal advice.</div>
      </div>
    </main>
  );
}