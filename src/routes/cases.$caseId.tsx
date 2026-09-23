import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  FileText,
  LogOut,
  Menu,
  PanelLeft,
  Plus,
  Scale,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import seal from "@/assets/lexicon-seal.png";

export const Route = createFileRoute("/cases/$caseId")({
  head: () => ({
    meta: [
      { title: "Case workspace | Lexicon" },
      { name: "description", content: "A private Lexicon case workspace for understanding legal documents and preparing next steps." },
      { property: "og:title", content: "Case workspace | Lexicon" },
      { property: "og:description", content: "A private Lexicon case workspace for understanding legal documents and preparing next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseWorkspace,
});

type LegalCase = Tables<"legal_cases">;
type SavedMessage = Tables<"legal_messages">;

const messageText = (message: UIMessage) =>
  message.parts.filter((part) => part.type === "text").map((part) => part.text).join("");

const savedToUiMessage = (message: SavedMessage): UIMessage => ({
  id: message.id,
  role: message.role === "assistant" ? "assistant" : "user",
  parts: [{ type: "text", text: message.content }],
});

function CaseWorkspace() {
  const { caseId } = Route.useParams();
  const navigate = useNavigate();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [legalCase, setLegalCase] = useState<LegalCase | null>(null);
  const [savedMessages, setSavedMessages] = useState<UIMessage[]>([]);
  const [caseList, setCaseList] = useState<LegalCase[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { caseId } }), [caseId]);
  const chat = useChat({
    id: caseId,
    messages: savedMessages,
    transport,
    onError: (error) => console.error("Lexicon chat error", error),
    onFinish: ({ message }) => {
      const assistantText = messageText(message);
      if (assistantText) {
        void supabase.from("legal_messages").insert({ case_id: caseId, user_id: "", role: "assistant", content: assistantText });
      }
      composerRef.current?.focus();
    },
  });

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { await navigate({ to: "/auth" }); return; }
      if (mounted) setEmail(data.session.user.email ?? "");
      const [caseResult, messagesResult, listResult] = await Promise.all([
        supabase.from("legal_cases").select("*").eq("id", caseId).single(),
        supabase.from("legal_messages").select("*").eq("case_id", caseId).order("created_at", { ascending: true }),
        supabase.from("legal_cases").select("*").order("updated_at", { ascending: false }),
      ]);
      if (!mounted) return;
      setLegalCase(caseResult.data);
      setSavedMessages((messagesResult.data ?? []).map(savedToUiMessage));
      setCaseList(listResult.data ?? []);
      setLoading(false);
      composerRef.current?.focus();
    });
    return () => { mounted = false; };
  }, [caseId, navigate]);

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || !legalCase) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { await navigate({ to: "/auth" }); return; }
    await supabase.from("legal_messages").insert({ case_id: caseId, user_id: userData.user.id, role: "user", content: cleanText });
    await chat.sendMessage({ text: cleanText });
  };

  const signOut = async () => { await supabase.auth.signOut(); await navigate({ to: "/" }); };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading your case…</div>;
  if (!legalCase) return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center"><h1 className="font-serif text-4xl">That case isn’t available.</h1><Button asChild><Link to="/cases">Back to cases</Link></Button></div>;

  return (
    <main className="flex h-screen min-h-[680px] flex-col overflow-hidden bg-background">
      <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border bg-card/75 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open cases" onClick={() => setSidebarOpen(true)}><Menu className="size-5" /></Button><Link to="/cases" className="hidden items-center gap-2 lg:flex"><img src={seal} alt="Lexicon seal" className="size-8 object-contain" /><span className="font-serif text-lg">lexicon</span></Link><span className="hidden text-border lg:block">/</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{legalCase.title}</p><p className="truncate text-xs text-muted-foreground">{legalCase.document_name || "Question-led case"}</p></div></div>
        <div className="flex items-center gap-1"><Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Toggle document context" title="Toggle document context" onClick={() => setContextOpen(!contextOpen)}><PanelLeft className="size-4" /></Button><Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" title={`Sign out ${email}`}><LogOut className="size-4" /></Button></div>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 z-50 flex w-[20rem] shadow-2xl" : "hidden"} w-[19rem] shrink-0 flex-col border-r border-border bg-card lg:flex`}>
          <div className="flex h-[4.5rem] items-center justify-between border-b border-border px-5"><Link to="/cases" className="flex items-center gap-2"><img src={seal} alt="Lexicon seal" className="size-8 object-contain" /><span className="font-serif text-lg">lexicon</span></Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close cases"><X className="size-4" /></Button></div>
          <div className="flex items-center justify-between px-5 pb-3 pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your cases</p><Button asChild variant="ghost" size="icon" aria-label="New case" title="New case"><Link to="/cases/new"><Plus className="size-4" /></Link></Button></div>
          <nav className="space-y-1 overflow-y-auto px-3">{caseList.map((item) => <Link key={item.id} to="/cases/$caseId" params={{ caseId: item.id }} onClick={() => setSidebarOpen(false)} className={`block border-l-2 px-3 py-3 transition-colors ${item.id === caseId ? "border-primary bg-secondary" : "border-transparent hover:bg-secondary/60"}`}><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{item.document_name || "Question-led case"}</p></Link>)}</nav>
          <div className="mt-auto border-t border-border p-5"><p className="truncate text-xs text-muted-foreground">{email}</p><div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Private by default</div></div>
        </aside>
        {sidebarOpen && <button type="button" className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" aria-label="Close cases" onClick={() => setSidebarOpen(false)} />}
        <section className="relative flex min-w-0 flex-1 flex-col">
          <Conversation className="min-h-0 flex-1"><ConversationContent className="mx-auto w-full max-w-3xl px-5 pb-32 pt-8 sm:px-8">{chat.messages.length === 0 ? <ConversationEmptyState icon={<img src={seal} alt="" className="size-16 object-contain" />} title="What would you like to understand?" description="Ask about a clause, a concern, or the next question to bring to counsel." /> : chat.messages.map((message) => <Message key={message.id} from={message.role}><MessageContent>{message.role === "assistant" ? <MessageResponse>{messageText(message)}</MessageResponse> : <p className="whitespace-pre-wrap leading-6">{messageText(message)}</p>}</MessageContent></Message>)}{chat.status === "submitted" || chat.status === "streaming" ? <Message from="assistant"><MessageContent><Shimmer>Reading the details…</Shimmer></MessageContent></Message> : null}</ConversationContent><ConversationScrollButton /></Conversation>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent px-5 pb-5 pt-14 sm:px-8"><PromptInput className="pointer-events-auto mx-auto max-w-3xl border-border bg-card shadow-xl shadow-primary/5" onSubmit={({ text }) => void sendMessage(text)}><PromptInputTextarea ref={composerRef} placeholder="Ask about this case…" disabled={chat.status === "submitted" || chat.status === "streaming"} /><PromptInputFooter className="justify-end"><PromptInputSubmit status={chat.status} onStop={chat.stop} disabled={chat.status === "submitted" || chat.status === "streaming"} /></PromptInputFooter></PromptInput><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">Lexicon provides legal information, not legal advice.</p></div>
        </section>
        {contextOpen && <aside className="hidden w-[20rem] shrink-0 overflow-y-auto border-l border-border bg-card p-6 xl:block"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Case context</p><h2 className="mt-3 font-serif text-2xl">{legalCase.document_name || "No document title"}</h2><div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-primary" /> Available to the assistant</div><div className="mt-7 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Provided text</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{legalCase.document_text || "No document text added yet. Create a new case with the relevant agreement, policy, letter, or facts to get document-aware answers."}</p></div></aside>}
      </div>
    </main>
  );
}