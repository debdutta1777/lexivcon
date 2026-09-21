import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileText, LockKeyhole, Scale } from "lucide-react";
import seal from "@/assets/lexicon-seal.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lexicon | Understand what the fine print means" },
      { name: "description", content: "A private legal workspace for simplifying documents, spotting risks, and preparing questions for counsel." },
      { property: "og:title", content: "Lexicon | Understand what the fine print means" },
      { property: "og:description", content: "A private legal workspace for simplifying documents, spotting risks, and preparing questions for counsel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="Lexicon home">
          <img src={seal} alt="Lexicon seal" className="size-9 object-contain" />
          <span className="font-serif text-xl tracking-tight">lexicon</span>
        </Link>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
        >
          Sign in <ArrowRight className="size-4" />
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Scale className="size-4" /> Clarity for the fine print
          </p>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight sm:text-7xl">
            Know what you’re signing.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            Lexicon turns dense legal language into clear, useful understanding—so you can spot the important parts, ask sharper questions, and take your next step with confidence.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Open your workspace <ArrowRight className="size-4" />
            </Link>
            <span className="text-sm text-muted-foreground">Free to start · Private by design</span>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
            {["Plain-language summaries", "Clause-by-clause clarity", "Questions for counsel"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="size-4 text-primary" /> {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-secondary/70 blur-3xl" />
          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-primary/5 sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="size-5" /></div>
                <div><p className="text-sm font-semibold">Employment Agreement</p><p className="text-xs text-muted-foreground">Uploaded just now</p></div>
              </div>
              <LockKeyhole className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-5 py-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lexicon’s read</p>
              <h2 className="font-serif text-3xl leading-tight">The clause that deserves your attention.</h2>
              <p className="text-sm leading-7 text-muted-foreground">The agreement includes a 12-month non-solicitation restriction after you leave. Here’s what it may cover, what is unclear, and what to ask before signing.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[["01", "Key clause", "Non-solicitation"], ["02", "Open question", "Which clients?"], ["03", "Next step", "Ask for scope"]].map(([number, label, value]) => (
                  <div key={number} className="border-t-2 border-primary/30 pt-3"><p className="text-xs text-muted-foreground">{number} · {label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-4 text-sm"><img src={seal} alt="" className="size-7 object-contain" /><span>Ask anything about this document in your private case workspace.</span></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3 lg:px-10">
          {[["01", "Simplify", "Get the plain-language version without losing the important nuance."], ["02", "Spot risk", "Surface obligations, inconsistencies, deadlines, and clauses worth a closer look."], ["03", "Prepare", "Walk into a conversation with counsel with organized facts and better questions."]].map(([number, title, copy]) => (
            <div key={number} className="border-l-2 border-primary/35 pl-5"><p className="text-sm font-semibold text-primary">{number}</p><h2 className="mt-2 font-serif text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="font-serif text-lg text-foreground">lexicon</span>
        <span>Legal information, not legal advice.</span>
      </footer>
    </main>
  );
}
