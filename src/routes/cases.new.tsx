import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FileText, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import seal from "@/assets/lexicon-seal.png";

export const Route = createFileRoute("/cases/new")({
  head: () => ({
    meta: [
      { title: "New case | Lexicon" },
      { name: "description", content: "Create a private Lexicon case for a document or legal question." },
      { property: "og:title", content: "New case | Lexicon" },
      { property: "og:description", content: "Create a private Lexicon case for a document or legal question." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewCasePage,
});

function NewCasePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void supabase.auth.getSession().then(({ data }) => { if (!data.session) void navigate({ to: "/auth" }); }); }, [navigate]);

  const createCase = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError(null);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { await navigate({ to: "/auth" }); return; }
    const result = await supabase.from("legal_cases").insert({ user_id: userData.user.id, title: title.trim(), document_name: documentName.trim() || null, document_text: documentText.trim() || null }).select("id").single();
    if (result.error || !result.data) { setError(result.error?.message ?? "We couldn’t create that case."); setBusy(false); return; }
    await navigate({ to: "/cases/$caseId", params: { caseId: result.data.id } });
  };

  return <main className="min-h-screen bg-background"><header className="border-b border-border"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 lg:px-10"><Link to="/cases" className="flex items-center gap-3"><img src={seal} alt="Lexicon seal" className="size-9 object-contain" /><span className="font-serif text-xl">lexicon</span></Link><Link to="/cases" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link></div></header><div className="mx-auto max-w-3xl px-5 py-12 lg:px-10 lg:py-20"><Link to="/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All cases</Link><div className="mt-10"><p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><Scale className="size-4" /> New private case</p><h1 className="mt-4 font-serif text-5xl tracking-tight">Give your question a home.</h1><p className="mt-4 max-w-xl leading-7 text-muted-foreground">Add a title and, if you have it, paste the relevant document text. You can always add or change the context later.</p></div><form onSubmit={createCase} className="mt-12 space-y-6"><label className="block text-sm font-semibold">Case title<Input className="mt-2 h-12" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Employment agreement review" required /></label><label className="block text-sm font-semibold">Document name <span className="font-normal text-muted-foreground">(optional)</span><Input className="mt-2 h-12" value={documentName} onChange={(event) => setDocumentName(event.target.value)} placeholder="e.g. Offer letter.pdf" /></label><label className="block text-sm font-semibold">Relevant text <span className="font-normal text-muted-foreground">(optional)</span><textarea className="mt-2 min-h-56 w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" value={documentText} onChange={(event) => setDocumentText(event.target.value)} placeholder="Paste a clause, agreement, policy, letter, or the facts you want to understand…" /></label><div className="flex items-center justify-between border-t border-border pt-6"><p className="flex items-center gap-2 text-xs text-muted-foreground"><FileText className="size-4" /> You can add more context later.</p><Button type="submit" className="rounded-lg" disabled={busy}>{busy ? "Creating…" : "Create case"}<ArrowRight className="size-4" /></Button></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</form></div></main>;
}