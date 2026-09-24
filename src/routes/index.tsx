import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileText,
  GitCompareArrows,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
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

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: "Plain-language summaries",
    copy: "Get the gist of any agreement in minutes—what it says, what it means for you, and what changed from the norm.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare documents",
    copy: "Put two contracts or policies side by side and see what was added, removed, or quietly rewritten.",
  },
  {
    icon: TriangleAlert,
    title: "Risk & clause spotlight",
    copy: "Surface obligations, deadlines, auto-renewals, liability limits, and inconsistencies before they surprise you.",
  },
  {
    icon: MessageSquareText,
    title: "Ask your document anything",
    copy: "Chat directly with your uploaded document. Every answer stays grounded in the text you provided.",
  },
  {
    icon: ListChecks,
    title: "Checklists & next steps",
    copy: "Turn a confusing document into an actionable checklist—what to do, what to ask, and what to watch.",
  },
  {
    icon: ShieldCheck,
    title: "Prepare for counsel",
    copy: "Walk into a meeting with a lawyer armed with organized facts, sharp questions, and a clear summary.",
  },
];

const steps = [
  ["01", "Add your document", "Paste the text of a contract, lease, policy, or notice into a private case workspace."],
  ["02", "Lexicon reads it", "Get a clear summary, the clauses that matter, and the questions worth asking—organized for you."],
  ["03", "Take your next step", "Follow a checklist, compare versions, or bring a prepared brief to a legal professional."],
];

const marqueeItems = [
  "Employment agreements",
  "Rental leases",
  "NDAs",
  "Terms of service",
  "Freelance contracts",
  "Privacy policies",
  "Loan documents",
  "Settlement offers",
];

const faqs = [
  ["Is Lexicon a law firm?", "No. Lexicon provides legal information and helps you understand documents—it does not replace advice from a licensed attorney."],
  ["Are my documents private?", "Yes. Your cases and documents are saved to your private account and are only visible to you."],
  ["What kinds of documents work best?", "Contracts, leases, policies, notices, and letters. The clearer the text you provide, the sharper the analysis."],
  ["What should I do with the results?", "Use them to understand your position and prepare questions. For decisions with real consequences, consult a legal professional."],
];

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

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div>
          <Reveal>
            <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <Scale className="size-4" /> Clarity for the fine print
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight sm:text-7xl">
              Know what you’re signing.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Lexicon turns dense legal language into clear, useful understanding—so you can spot the important parts, ask sharper questions, and take your next step with confidence.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                className="animate-pulse-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Open your workspace <ArrowRight className="size-4" />
              </Link>
              <span className="text-sm text-muted-foreground">Free to start · Private by design</span>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
              {["Plain-language summaries", "Clause-by-clause clarity", "Questions for counsel"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={250} className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-secondary/70 blur-3xl" />
          <div className="animate-float-slow rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-primary/5 sm:p-7">
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
        </Reveal>
      </section>

      {/* Marquee */}
      <section className="border-y border-border bg-secondary/45 py-5" aria-label="Document types Lexicon can read">
        <div className="relative overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap px-5">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <Sparkles className="size-4 text-primary" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <Reveal>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Search className="size-4" /> What Lexicon does
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            One workspace for every document you don’t fully understand.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 90}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">From fine print to clear plan, in three steps.</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {steps.map(([number, title, copy], index) => (
              <Reveal key={number} delay={index * 120}>
                <div className="border-l-2 border-primary/35 pl-5">
                  <p className="text-sm font-semibold text-primary">{number}</p>
                  <h3 className="mt-2 font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Honest answers, before you ask.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Lexicon is built to inform and prepare you—not to replace a lawyer. Here’s what that means in practice.
            </p>
          </Reveal>
          <div className="space-y-4">
            {faqs.map(([question, answer], index) => (
              <Reveal key={question} delay={index * 80}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-semibold">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
            <div className="absolute -left-20 -top-20 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 size-72 rounded-full bg-primary-foreground/10 blur-3xl" />
            <h2 className="relative mx-auto max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Your next signature deserves a second look.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-primary-foreground/80">
              Start a private case, add your document, and see it clearly—before you agree to anything.
            </p>
            <Link
              to="/auth"
              className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-7 py-3 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              Get started free <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-border px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="font-serif text-lg text-foreground">lexicon</span>
        <span>Legal information, not legal advice.</span>
      </footer>
    </main>
  );
}
