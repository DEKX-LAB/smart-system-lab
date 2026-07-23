import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight, Bot, Cog, Database, Mail, Linkedin, MessageCircle,
  Zap, Globe, Lock, Sparkles, Check, ExternalLink, Github, Download,
} from "lucide-react";
import { z } from "zod";
import profileAsset from "@/assets/profile.png.asset.json";
import cvAsset from "@/assets/Adetola_Adekunle_CV.pdf.asset.json";
import { Reveal } from "@/components/Reveal";
import { AutomationSavingsCalculator } from "@/components/AutomationSavingsCalculator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/inquiries.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-bold text-lg tracking-tight">
          DEKX<span className="text-primary">.</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="hover:text-foreground transition-colors">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Let's Talk <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <section id="top" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center w-full">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
          >
            I build AI systems that{" "}
            <span className="relative whitespace-nowrap">
              <span className="text-primary">run your business</span>
            </span>{" "}
            while you sleep.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            No-code automation specialist helping small businesses and startups replace
            manual work with intelligent, self-running systems — on WhatsApp, in the
            cloud, and across your tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              View My Work <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium hover:bg-surface transition-colors"
            >
              Book a Free Call
            </a>
          </motion.div>
        </div>

        <motion.div style={{ y }} className="relative order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[420px]">
            <div className="aspect-square rounded-full overflow-hidden border-2 border-primary/50 shadow-2xl shadow-primary/20">
              <img
                src={profileAsset.url}
                alt="Adetola Adekunle Ebenezer - AI Automation Specialist"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tools strip */}
      <div className="absolute bottom-0 inset-x-0 border-t border-border bg-background/40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
          <span className="text-xs uppercase tracking-widest text-muted-foreground shrink-0">
            Tools I work with
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70 font-medium">
            {["n8n", "Supabase", "Google Gemini", "GreenAPI", "Pinecone", "Lovable", "Twilio", "PostgreSQL"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const HOOKS = [
  { icon: Zap, stat: "5", label: "Automated workflows", caption: "Built and shipped in one clinical system" },
  { icon: Bot, stat: "RAG", label: "Powered AI agents", caption: "That actually answer customer questions correctly" },
  { icon: Globe, stat: "24/7", label: "Remote-ready", caption: "Built for clients across time zones" },
  { icon: Lock, stat: "Prod", label: "Production-grade", caption: "Not demos, not prototypes" },
];

function TrustBar() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOOKS.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.08}>
              <div className="group rounded-xl border border-border bg-surface/40 p-5 h-full transition-all hover:border-primary/40 hover:bg-surface">
                <h.icon className="h-5 w-5 text-primary" />
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display font-bold text-2xl tracking-tight">{h.stat}</span>
                  <span className="text-sm text-foreground/80">{h.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{h.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Bot,
    title: "AI Agents & Chatbots",
    desc: "Intelligent WhatsApp bots that answer customer questions instantly, using RAG to pull real answers from your knowledge base — not generic chatbot scripts.",
  },
  {
    icon: Cog,
    title: "Workflow Automation",
    desc: "End-to-end systems connecting your tools, eliminating manual data entry, and running on schedule without anyone touching a keyboard.",
  },
  {
    icon: Database,
    title: "Smart Dashboards & Databases",
    desc: "Real-time dashboards built on Supabase and PostgreSQL, so you always know exactly what's happening in your business — live.",
  },
];

function Services() {
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              What I Build
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three ways I help businesses stop doing repetitive work manually.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-surface hover:shadow-[0_20px_60px_-20px] hover:shadow-primary/30">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    tag: "Healthcare Automation",
    title: "ClinicFlow",
    status: "Live",
    short: "A WhatsApp-based clinical automation system handling patient registration, staff alerts, AI query responses, and daily reporting — across 5 connected workflows.",
    stack: ["n8n", "Supabase", "PostgreSQL", "Google Gemini", "GreenAPI", "Lovable"],
    links: [
      { label: "View Workflow", href: "https://github.com/DEKX-LAB/clinicflow-automation" },
      { label: "View Dashboard", href: "https://pulse-flow-manage.lovable.app" },
    ],
    problem: "Staff were manually onboarding patients over WhatsApp, copying details into spreadsheets, and chasing daily reports.",
    solution: "Five connected n8n workflows running on a shared Supabase schema, with normalized phone numbers and parallel branches for patient, staff, and admin events.",
    wins: [
      "PostgreSQL timestamp filtering for accurate daily reports",
      "Parallel node execution for sub-second responses",
      "Phone number normalisation across all 5 workflows",
    ],
  },
  {
    tag: "AI Customer Support",
    title: "RAG-Powered WhatsApp Support Agent",
    status: "Client Delivered",
    short: "An AI agent that answers customer questions instantly on WhatsApp by retrieving real answers from a live knowledge base using vector search — with automatic fallback when traffic spikes.",
    stack: ["n8n", "Pinecone", "Google Gemini", "Groq", "Twilio", "Airtable", "Tally"],
    links: [
      { label: "View Workflow", href: "https://drive.google.com/drive/folders/1Oy5kPSOeX3uk12yFxjzoPEqU3iTb7Ogq?usp=sharing" },
    ],
    problem: "Support team was drowning in repetitive customer questions, with response times stretching to hours.",
    solution: "A retrieval-augmented agent on WhatsApp grounded in the client's docs, with Gemini as primary and Groq as automatic fallback when latency spikes.",
    wins: [
      "Vector search returning grounded, accurate answers",
      "Dual-model fallback for 99.9% uptime",
      "Automatic ticket logging in Airtable for unresolved queries",
    ],
  },
  {
    tag: "No-Code Event Management",
    title: "EventHub",
    status: "Live",
    short: "A fully automated AI-powered event management portal built for teams managing registrations, attendee communications, and event logistics — without writing a single line of code.",
    stack: ["n8n", "Airtable", "Softr", "Google Gemini", "AI Automation"],
    links: [
      { label: "View Project", href: "https://github.com/DEKX-LAB/EventHub-No-Code-Event-Management-Platform" },
      { label: "Live Demo", href: "https://tambra7327.softr.app" },
    ],
    problem: "Event teams managing registrations and attendee communication manually across spreadsheets and email.",
    solution: "A no-code event portal with automated registration flows, AI-powered responses, and real-time attendee management.",
    winsLabel: "Key Features",
    wins: [
      "Automated attendee registration",
      "AI query handling via Gemini",
      "Real-time event dashboard",
      "Team notifications",
    ],
  },
];

function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              Projects You Can Actually See
            </h2>
            <p className="mt-3 text-muted-foreground">
              Not slides. Not mockups. Real systems, built and running.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={p.title} delay={i * 0.1}>
                <article className="h-full rounded-2xl border border-border bg-surface/40 p-6 sm:p-7 transition-all hover:border-primary/40">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.tag}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Status: {p.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display font-bold text-2xl tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.short}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="text-[11px] rounded-md border border-border bg-background/40 px-2 py-1 text-foreground/80">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {l.label} <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      {isOpen ? "Hide details" : "See case study"}
                    </button>
                  </div>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-6 border-t border-border space-y-4 text-sm"
                    >
                      <div>
                        <h4 className="font-display font-semibold text-foreground/90">The Problem</h4>
                        <p className="mt-1 text-muted-foreground leading-relaxed">{p.problem}</p>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground/90">The Solution</h4>
                        <p className="mt-1 text-muted-foreground leading-relaxed">{p.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-foreground/90">{("winsLabel" in p && p.winsLabel) || "Key Technical Wins"}</h4>
                        <ul className="mt-2 space-y-1.5">
                          {p.wins.map((w) => (
                            <li key={w} className="flex gap-2 text-muted-foreground">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <AutomationSavingsCalculator />
      </div>
    </section>
  );
}

const SKILL_GROUPS = [
  { label: "Automation & Workflow", items: ["n8n", "Webhook architecture", "Cron scheduling", "Multi-branch workflow logic"] },
  { label: "AI & Machine Learning", items: ["Google Gemini", "Groq", "RAG", "Vector search", "Pinecone", "AI agent design"] },
  { label: "Databases & Backend", items: ["Supabase", "PostgreSQL", "Airtable", "SQL optimisation", "Schema design"] },
  { label: "Messaging & Delivery", items: ["GreenAPI", "Twilio", "WhatsApp Business API"] },
  { label: "Frontend & Dashboards", items: ["Lovable", "Real-time data visualisation"] },
  { label: "Tools", items: ["Tally", "Cloudinary", "Git", "Google Cloud"] },
];

function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            The Stack Behind the Systems
          </h2>
        </Reveal>

        <div className="mt-12 space-y-6">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.05}>
              <div className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8 items-start rounded-xl border border-border bg-surface/30 p-5">
                <h3 className="font-display font-semibold text-foreground/90 text-sm uppercase tracking-widest">
                  {g.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background/50 px-3 py-1.5 text-sm text-foreground/85 transition-all hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_-5px] hover:shadow-primary/40"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Discovery Call", desc: "We talk through what's eating your time." },
  { n: "02", title: "System Design", desc: "I map the exact workflow before building anything." },
  { n: "03", title: "Build & Test", desc: "Your system gets built, tested, and refined." },
  { n: "04", title: "Launch & Support", desc: "You go live, and I stay on for fixes and improvements." },
];

function Process() {
  return (
    <section id="process" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            How a Project Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Four steps from "I'm tired of doing this manually" to "It runs on its own."
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="grid lg:grid-cols-4 gap-6 lg:gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative">
                  <div className="flex lg:block items-center gap-4">
                    <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-background font-display font-bold text-primary">
                      {s.n}
                    </div>
                    <div className="lg:mt-5">
                      <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-[14rem]">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "adekunleadetola8@gmail.com",
    desc: "Best for detailed project briefs.",
    cta: "Send Email",
    href: "mailto:adekunleadetola8@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Adetola Adekunle",
    desc: "Connect and see what I've shipped.",
    cta: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/adetola-adekunle-82151b304",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Quick chat",
    desc: "Fastest way to reach me.",
    cta: "Chat on WhatsApp",
    href: "https://wa.me/2348123401209",
  },
];

function ContactBlock() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            Talk to Me Directly
          </h2>
          <p className="mt-3 text-muted-foreground">
            Prefer a quick message over a form? Reach me here.
          </p>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface/40 p-6 flex flex-col">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold">{c.label}</h3>
                <p className="text-sm text-foreground/85 break-all">{c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background/50 px-4 py-2 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {c.cta} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <InquiryForm />
      </div>
    </section>
  );
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(150).optional(),
  service: z.string().min(1, "Please pick a service"),
  budget: z.string().optional(),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(2000),
});

const SERVICE_OPTIONS = [
  "AI Chatbot / Customer Support Agent",
  "Workflow Automation",
  "Dashboard / Database System",
  "Not sure yet — need a consultation",
];
const BUDGET_OPTIONS = ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "Let's discuss"];

function InquiryForm() {
  const submit = useServerFn(submitInquiry);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", company: "", service: "", budget: "", message: "",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Please check the form";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        full_name: parsed.data.name,
        email: parsed.data.email,
        company_name: parsed.data.company || null,
        service_needed: parsed.data.service,
        budget_range: parsed.data.budget || null,
        project_details: parsed.data.message,
      };
      console.log("[InquiryForm] submitting", payload);
      const res = await submit({ data: payload });
      console.log("[InquiryForm] success", res);
      setForm({ name: "", email: "", company: "", service: "", budget: "", message: "" });
      setDone(true);
      toast.success("Got it! I'll respond within 24 hours.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("[InquiryForm] submit failed:", err);
      setErrorMsg(msg);
      toast.error(`Submission failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Reveal>
      <div className="mt-16 rounded-2xl border border-border bg-surface/40 p-6 sm:p-10">
        <div className="max-w-2xl">
          <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            Tell Me What You Need
          </h3>
          <p className="mt-2 text-muted-foreground">
            Fill this out and I'll get back to you within 24 hours with next steps.
          </p>
        </div>

        {done ? (
          <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
            <p className="mt-4 font-display font-semibold text-xl">Got it!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              I'll respond within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid sm:grid-cols-2 gap-5">
            {errorMsg && (
              <div className="sm:col-span-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <strong className="font-semibold">Submission error:</strong> {errorMsg}
              </div>
            )}
            <Field label="Full Name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Email Address *">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Company / Business">
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </Field>
            <Field label="Service needed *">
              <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                <SelectTrigger><SelectValue placeholder="Choose one" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Project Budget" className="sm:col-span-2">
              <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tell me about your project *" className="sm:col-span-2">
              <Textarea
                rows={5}
                placeholder="What's taking up your time manually right now?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </Field>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send My Request"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </Reveal>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="font-display font-bold text-lg tracking-tight">
            DEKX<span className="text-primary">.</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Building systems that work while you don't.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © 2026 Adetola Adekunle Ebenezer. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/adetola-adekunle-82151b304"
            target="_blank" rel="noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/DEKX-LAB"
            target="_blank" rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="mailto:adekunleadetola8@gmail.com"
            target="_blank" rel="noreferrer"
            aria-label="Email"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Projects />
        <Skills />
        <Process />
        <ContactBlock />
      </main>
      <Footer />
      <Toaster theme="dark" />
    </div>
  );
}
