"use client"

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  ClipboardList,
  Download,
  ExternalLink,
  FileCheck2,
  Gauge,
  Landmark,
  LockKeyhole,
  Mail,
  Play,
  ShieldCheck,
  UsersRound,
} from "lucide-react"
import { Adobe, Copilot, OpenAI } from "@lobehub/icons"
import type { ComponentType, SVGProps } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type ToolOption = {
  id: string
  label: string
  risk: number
  note: string
  brand?: ComponentType<{ size?: number; className?: string }>
  fallback?: ComponentType<SVGProps<SVGSVGElement>>
}

const toolOptions: ToolOption[] = [
  {
    id: "chatgpt",
    label: "ChatGPT or Claude",
    risk: 18,
    note: "Public AI tools in daily staff workflows.",
    brand: OpenAI,
  },
  {
    id: "copilot",
    label: "Microsoft Copilot",
    risk: 14,
    note: "Embedded AI across documents and email.",
    brand: Copilot,
  },
  {
    id: "canva",
    label: "Canva or Adobe AI",
    risk: 10,
    note: "Marketing content, images, and campaign copy.",
    brand: Adobe,
  },
  {
    id: "crm",
    label: "CRM AI",
    risk: 16,
    note: "Customer records and sales recommendations.",
    fallback: UsersRound,
  },
  {
    id: "cv",
    label: "CV screening",
    risk: 28,
    note: "Employment decisions can trigger high-risk duties.",
    fallback: ClipboardList,
  },
]

type RegisterRow = {
  tool: string
  useCase: string
  data: string
  risk: string
  status: string
  brand?: ComponentType<{ size?: number; className?: string }>
  fallback?: ComponentType<SVGProps<SVGSVGElement>>
}

const registerRows: RegisterRow[] = [
  {
    tool: "ChatGPT Team",
    useCase: "HR drafts",
    data: "Personal data",
    risk: "High",
    status: "HR module pending",
    brand: OpenAI,
  },
  {
    tool: "Microsoft Copilot",
    useCase: "Email summaries",
    data: "Internal records",
    risk: "Limited",
    status: "Foundation complete",
    brand: Copilot,
  },
  {
    tool: "Canva AI",
    useCase: "Social content",
    data: "Public data",
    risk: "Minimal",
    status: "Marketing module due",
    brand: Adobe,
  },
  {
    tool: "Salesforce AI",
    useCase: "Lead scoring",
    data: "Customer data",
    risk: "Limited",
    status: "Register review due",
    fallback: UsersRound,
  },
]

const trainingRows = [
  ["Foundation", "All staff", "30 min", "81% complete"],
  ["HR and recruitment", "People teams", "55 min", "3 seats pending"],
  ["Board briefing", "Directors", "75 min", "Scheduled"],
]

const evidenceItems = [
  "AI literacy policy with scope, owners, and review cadence",
  "AI use register mapped to tools, roles, data, and risk tier",
  "Time-stamped training logs with curriculum version history",
  "Completion certificates with QR verification",
  "One-click compliance pack for regulator, tribunal, or solicitor requests",
]

export default function Home() {
  const [selectedTools, setSelectedTools] = useState(["chatgpt", "copilot", "cv"])
  const [staffCount, setStaffCount] = useState("18")

  const riskScore = useMemo(() => {
    const toolRisk = toolOptions
      .filter((tool) => selectedTools.includes(tool.id))
      .reduce((total, tool) => total + tool.risk, 0)
    const staffRisk = Math.min(Number(staffCount || 0) * 0.9, 22)

    return Math.min(Math.round(toolRisk + staffRisk), 96)
  }, [selectedTools, staffCount])

  const riskTier =
    riskScore >= 70 ? "Attention required" : riskScore >= 42 ? "Evidence gap" : "Low exposure"

  function toggleTool(id: string) {
    setSelectedTools((current) =>
      current.includes(id) ? current.filter((tool) => tool !== id) : [...current, id]
    )
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteNav />

      {/* Stat-Led hero — the exposure score is the figure, the words complete it. */}
      <section
        id="top"
        className="mx-auto w-[min(94%,72rem)] pb-6 pt-10 lg:pb-10 lg:pt-16"
      >
        <div className="flex flex-col gap-2">
          <span className="tnum text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Article 4 · AI literacy evidence for Irish employers
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h1 className="display-wrap font-display text-[clamp(2.75rem,5vw+1rem,4.75rem)] font-semibold leading-[1.02]">
                Audit-ready AI compliance, not another course library.
              </h1>
              <p className="max-w-[62ch] text-base leading-7 text-muted-foreground md:text-lg">
                AIFirst turns AI literacy training, tool inventory, role mapping, and policy records
                into one defensible Article 4 compliance pack for Irish SMEs.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="h-10 rounded-full px-5" size="lg">
                Run risk check
                <Gauge data-icon="inline-end" aria-hidden="true" />
              </Button>
              <Button className="h-10 rounded-full px-5" size="lg" variant="outline">
                View audit pack
                <Download data-icon="inline-end" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <RiskCalculator
            riskScore={riskScore}
            riskTier={riskTier}
            selectedTools={selectedTools}
            staffCount={staffCount}
            setStaffCount={setStaffCount}
            toggleTool={toggleTool}
          />
        </div>

        {/* Lead figure + supporting-stat row — the Stat-Led spine. */}
        <div className="mt-10 hairline pt-8 lg:mt-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end md:gap-12">
            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-sm text-muted-foreground">Your live exposure, this calculator</p>
              <StatFigure value={riskScore} />
              <p className="max-w-[40ch] text-sm leading-6 text-muted-foreground">
                Out of 96. The higher it climbs, the wider the Article 4 evidence gap a regulator or
                tribunal could point to.
              </p>
            </div>
            <div
              className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border sm:grid-cols-3"
              style={{ backgroundColor: "var(--color-rule)" }}
            >
              <MiniStat label="Article 4 applies" value="2 Feb 2025" />
              <MiniStat label="Irish authorities live" value="2 Aug 2026" />
              <MiniStat label="Non-compliance ceiling" value="EUR 15M / 3%" />
            </div>
          </div>
        </div>
      </section>

      <ProblemBand />

      <AuthoritiesSection />

      <ResourcesSection />

      <LetterSection />

      <VaultSection />

      <TrainingSection />

      <RegisterSection registerRows={registerRows} />

      <PricingSection />

      <ClosingCTA />

      <SiteFooter />
    </main>
  )
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-[min(94%,72rem)] items-center justify-between gap-3 py-3">
        <a
          className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold"
          href="#top"
        >
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck aria-hidden="true" className="size-4" />
          </span>
          <span className="font-display tracking-tight">AIFirst</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {[
            ["Letter", "#letter"],
            ["Authorities", "#authorities"],
            ["Risk", "#risk"],
            ["Vault", "#vault"],
            ["Training", "#training"],
            ["Pricing", "#pricing"],
          ].map(([item, href]) => (
            <a
              className="focus-ring rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={href}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
        <Button className="rounded-full" size="lg">
          Book demo
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}

function StatFigure({ value }: { value: number }) {
  const displayedRef = useRef(0)
  const [displayed, setDisplayed] = useState(value)
  const frame = useRef<number | null>(null)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  }, [])

  useEffect(() => {
    if (prefersReduced.current) {
      setDisplayed(value)
      displayedRef.current = value
      return
    }
    const from = displayedRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const duration = 480

    function step(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = Math.round(from + (to - from) * eased)
      setDisplayed(next)
      if (t < 1) {
        frame.current = requestAnimationFrame(step)
      } else {
        displayedRef.current = to
      }
    }

    frame.current = requestAnimationFrame(step)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      displayedRef.current = to
    }
  }, [value])

  return (
    <div
      className="tnum stat-figure font-semibold leading-[0.85] text-foreground"
      style={{ fontSize: "var(--text-stat)" }}
      aria-live="polite"
    >
      {String(displayed).padStart(2, "0")}
    </div>
  )
}

function RiskCalculator({
  riskScore,
  riskTier,
  selectedTools,
  staffCount,
  setStaffCount,
  toggleTool,
}: {
  riskScore: number
  riskTier: string
  selectedTools: string[]
  staffCount: string
  setStaffCount: (value: string) => void
  toggleTool: (id: string) => void
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="font-display text-lg tracking-tight">
          Irish SME AI Risk Calculator
        </CardTitle>
        <CardDescription>
          Lead magnet preview for hidden Article 4 evidence gaps.
        </CardDescription>
        <CardAction>
          <Badge variant={riskScore >= 70 ? "destructive" : "secondary"}>{riskTier}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="rounded-lg bg-secondary p-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Current exposure</p>
              <p className="tnum text-4xl font-semibold">{riskScore}</p>
            </div>
            <AlertTriangle className="text-destructive" aria-hidden="true" />
          </div>
          <Progress value={riskScore}>
            <ProgressLabel className="sr-only">Risk score</ProgressLabel>
            <ProgressValue className="sr-only" />
          </Progress>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Staff using AI</span>
          <input
            className="h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-55 md:text-sm"
            inputMode="numeric"
            min="1"
            onChange={(event) => setStaffCount(event.target.value)}
            type="number"
            value={staffCount}
          />
          <span className="min-h-[1lh] text-sm text-muted-foreground">
            Used to estimate training evidence volume and reminder load.
          </span>
        </label>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">AI tools in use</p>
          {toolOptions.map((tool) => {
            const checked = selectedTools.includes(tool.id)

            return (
              <button
                className={cn(
                  "focus-ring flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 text-left transition-[background-color,border-color,transform] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
                  checked ? "border-ring bg-secondary" : "hover:bg-secondary/70"
                )}
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                type="button"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded border",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-input"
                  )}
                  aria-hidden="true"
                >
                  {checked ? <Check /> : null}
                </span>
                <ToolMark tool={tool} />
                <span className="min-w-0">
                  <span className="block font-medium">{tool.label}</span>
                  <span className="block text-sm leading-6 text-muted-foreground">{tool.note}</span>
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">Output: policy, register, training plan</span>
        <Button>
          Email report
          <Mail data-icon="inline-end" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      <p className="tnum mt-1.5 text-sm font-semibold">{value}</p>
    </div>
  )
}

type Markable = {
  brand?: ComponentType<{ size?: number; className?: string }>
  fallback?: ComponentType<SVGProps<SVGSVGElement>>
}

function ToolMark({ tool, size = 18 }: { tool: Markable; size?: number }) {
  if (tool.brand) {
    const Brand = tool.brand
    return (
      <span className="grid shrink-0 place-items-center" aria-hidden="true">
        <Brand size={size} />
      </span>
    )
  }
  if (tool.fallback) {
    const Icon = tool.fallback
    return (
      <span
        className="grid shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
    )
  }
  return null
}

function Signal({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-accent-tint text-accent">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <h3 className="font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

function ProblemBand() {
  return (
    <section className="border-y bg-card/55">
      <div className="mx-auto grid w-[min(94%,72rem)] grid-cols-1 gap-10 py-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:py-16">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">The business problem</p>
          <h2 className="display-wrap font-display text-2xl font-semibold tracking-tight md:text-[2rem] md:leading-[1.1]">
            When AI causes a workplace, data, or client issue, training evidence becomes the file.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Signal icon={Landmark} title="Regulatory requests" body="Policies, logs, and tool records ready to export." />
          <Signal icon={UsersRound} title="Tribunal context" body="Role-specific training mapped to the AI system involved." />
          <Signal icon={LockKeyhole} title="Data handling" body="Prompts, personal data, and confidential records classified." />
          <Signal icon={BriefcaseBusiness} title="Staff readiness" body="Reminders and certificates tied to curriculum versions." />
        </div>
      </div>
    </section>
  )
}

const authorities = [
  { mono: "DPC", name: "Data Protection Commission", role: "Personal data & AI input handling" },
  { mono: "WRC", name: "Workplace Relations Commission", role: "Employment disputes & training evidence" },
  { mono: "AI\u00A0Office", name: "Irish AI Office", role: "Article 4 enforcement from 2 Aug 2026" },
  { mono: "CCPC", name: "Competition & Consumer Protection Commission", role: "Consumer-facing AI" },
  { mono: "CRA", name: "Commission for Regulation of Utilities", role: "Sectoral AI deployment" },
  { mono: "CIB", name: "Companies Investigation Branch", role: "Corporate governance & AI risk" },
]

function AuthoritiesSection() {
  return (
    <section id="authorities" className="mx-auto w-[min(94%,72rem)] py-16 md:py-20">
      <div className="flex flex-col gap-10">
        <div className="flex max-w-[52ch] flex-col gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Who comes asking for your records
          </span>
          <h2 className="display-wrap font-display text-3xl font-semibold tracking-tight md:text-[2.5rem] md:leading-[1.08]">
            Fifteen Irish authorities gain enforcement powers on 2 August.
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            Any of them can request your Article 4 training register and audit logs. These are the
            ones most likely to knock on an SME&rsquo;s door.
          </p>
        </div>

        <ul
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-3"
          style={{ backgroundColor: "var(--color-rule)" }}
        >
          {authorities.map((a) => (
            <li
              className="flex min-w-0 flex-col gap-3 bg-background p-5"
              key={a.mono}
            >
              <span
                className="tnum grid size-11 shrink-0 place-items-center rounded-md border text-xs font-semibold tracking-tight text-foreground"
                aria-hidden="true"
              >
                {a.mono}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-sm font-medium leading-5 tracking-tight">{a.name}</p>
                <p className="text-xs leading-5 text-muted-foreground">{a.role}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-sm leading-6 text-muted-foreground">
          Full list assigned under the Regulation of Artificial Intelligence Bill 2026, approved
          17 June 2026.
        </p>
      </div>
    </section>
  )
}

function ResourcesSection() {
  return (
    <section id="resources" className="border-y bg-card/40">
      <div className="mx-auto w-[min(94%,72rem)] py-14 md:py-20">
        <div className="flex flex-col gap-8">
          <div className="flex max-w-[48ch] flex-col gap-3">
            <span className="text-sm font-medium text-muted-foreground">Official EU resources</span>
            <h2 className="display-wrap font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Read the law your compliance pack is built on.
            </h2>
          </div>

          <a
            className="focus-ring group grid grid-cols-1 gap-6 rounded-xl border bg-background p-6 transition-[border-color,box-shadow] hover:border-accent/40 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] md:p-8"
            href="https://artificialintelligenceact.eu/ai-act-explorer/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-semibold tracking-tight text-accent group-hover:underline">
                  AI Act Explorer
                </span>
                <ExternalLink
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </div>
              <p className="max-w-[56ch] text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                Browse the full EU AI Act online — Official Journal version of 13 June 2024. Search
                for the parts that apply to you, including{" "}
                <span className="font-medium text-foreground">Article 4: AI literacy</span>, the
                obligation AIFirst helps you meet.
              </p>
              <span className="text-sm font-medium text-accent">Open the explorer</span>
            </div>
            <div
              className="flex min-h-[8rem] flex-col justify-between rounded-lg border bg-secondary/60 p-5"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-md border bg-background text-xs font-semibold">
                  EU
                </span>
                <span className="text-xs font-medium text-muted-foreground">Chapter I</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="tnum text-xs text-muted-foreground">Art. 4</p>
                <p className="font-display text-lg font-semibold tracking-tight">AI literacy</p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Deployers must ensure sufficient AI literacy for staff using AI systems.
                </p>
              </div>
            </div>
          </a>

          <p className="text-xs leading-5 text-muted-foreground">
            Maintained by the Future of Life Institute. Not an official EU site — use alongside the{" "}
            <a
              className="focus-ring underline-offset-2 hover:text-foreground hover:underline"
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
              rel="noopener noreferrer"
              target="_blank"
            >
              Official Journal text
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

const letterTimeline = [
  {
    date: "2 February 2025",
    state: "Passed",
    body: "Under Article 4 of the EU AI Act, \u201CAI Literacy\u201D became a binding legal obligation. Every company using AI is already legally required to ensure their staff are properly trained.",
  },
  {
    date: "17 June 2026",
    state: "Passed",
    body: "The Irish Government approved the Regulation of Artificial Intelligence Bill 2026, assigning powers to fifteen local regulatory authorities (including the DPC and the WRC) to police this.",
  },
  {
    date: "2 August 2026",
    state: "37 days away",
    body: "Compliance enforcement officially starts. Regulators gain the power to request your training registry and audit logs.",
  },
  {
    date: "August 2026 onwards",
    state: "Liability window",
    body: "Lack of documented employee training becomes an immediate liability in any standard Workplace Relations Commission (WRC) or Data Protection Commission (DPC) hearing involving automated systems or employee mistakes.",
  },
]

const letterNotes = [
  {
    title: "\u201CDeployer\u201D Status",
    body: "If your employees use ChatGPT, Copilot, or Canva AI for work, the EU classifies your business as a \u201CDeployer\u201D of AI. This means the legal burden of how those tools are used on your network falls entirely on you.",
  },
  {
    title: "The Real WRC Risk",
    body: "If an employee uses an AI tool to assist with hiring, performance reviews, or client communication, and a dispute or discrimination claim arises, the first document the WRC or a court will demand is your Article 4 Training Register. If you cannot prove your employee was trained on the risks of that tool, your business faces strict liability.",
  },
  {
    title: "Data Leakage Liability",
    body: "Copying client data or proprietary company information into a commercial, public AI system is a breach of Irish data privacy laws. You must have a sign-off sheet proving your staff were explicitly instructed on what they can and cannot paste into these systems.",
  },
]

const letterAssets = [
  {
    title: "The 30-Minute SME Foundation Course",
    body: "A straightforward, video-based compliance module designed for Irish staff. It covers data protection rules, generative AI limits, and practical boundaries. Your staff can complete it on their lunch break on their phones.",
  },
  {
    title: "Your Custom AI Use Policy",
    body: "A downloadable, legally compliant document that formally establishes what tools are allowed in your office.",
  },
  {
    title: "Your Live Audit Register",
    body: "A clean, downloadable PDF report containing verified training certificates and tool registries \u2014 ready to be handed to a regulator, insurer, or solicitor on demand.",
  },
]

function LetterSection() {
  return (
    <section id="letter" className="border-y bg-card/40">
      <div className="mx-auto w-[min(94%,60rem)] py-16 md:py-24">
        <article className="flex flex-col gap-10">
          {/* Letterhead */}
          <header className="flex flex-col gap-3">
            <p className="tnum text-xs uppercase tracking-[0.18em] text-muted-foreground">
              A letter to Irish business owners
            </p>
            <p className="text-sm text-muted-foreground">Date: 26 June 2026</p>
            <h2 className="display-wrap font-display text-2xl font-semibold leading-[1.15] tracking-tight md:text-[2rem]">
              The August 2nd deadline and what your business actually needs to do
            </h2>
          </header>

          {/* Salutation + opening prose */}
          <div className="flex flex-col gap-5 text-base leading-7 text-foreground/90">
            <p>Dear Colleague,</p>
            <p>
              If you are like most business owners in Ireland right now, you are probably tired of
              hearing about AI. Every software tool you pay for has added an &ldquo;AI
              assistant&rdquo; over the past year, and your team is almost certainly using these
              tools&mdash;whether to draft client emails, summarize slide decks, or review code.
            </p>
            <p>
              But there is a quiet, regulatory deadline approaching that has nothing to do with
              technology hype, and everything to do with protecting your business from legal
              liability.
            </p>
            <p>
              In exactly 37 days, on August 2nd, 2026, the Irish AI Office becomes officially
              active, and the enforcement phase of the EU AI Act begins.
            </p>
          </div>

          {/* The Critical Dates */}
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-xl font-semibold tracking-tight">The Critical Dates</h3>
            <p className="text-base leading-7 text-muted-foreground">
              These are the dates that matter to your balance sheet:
            </p>
            <ol className="flex flex-col gap-px overflow-hidden rounded-lg border" style={{ backgroundColor: "var(--color-rule)" }}>
              {letterTimeline.map((row) => (
                <li
                  className="grid grid-cols-1 gap-2 bg-background p-5 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] sm:gap-6"
                  key={row.date}
                >
                  <div className="flex flex-col gap-1">
                    <p className="tnum text-sm font-semibold">{row.date}</p>
                    <Badge className="w-fit" variant="secondary">
                      {row.state}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{row.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Compliance Notes */}
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              The Compliance Notes
            </h3>
            <p className="text-base leading-7 text-muted-foreground">
              You do not need to rewrite your entire operations, but you do need to cover three
              basic vulnerabilities before August:
            </p>
            <div className="flex flex-col gap-6">
              {letterNotes.map((note) => (
                <div className="flex flex-col gap-2" key={note.title}>
                  <p className="font-medium tracking-tight">{note.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{note.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="flex flex-col gap-5">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              How AIFirst Resolves This in 30 Minutes
            </h3>
            <div className="flex flex-col gap-5 text-base leading-7 text-foreground/90">
              <p>
                We built AIFirst to be as simple and low-friction as possible. We do not sell
                complex enterprise software or endless video courses.
              </p>
              <p>
                For a single, transparent charge of &euro;199, we provide you with three exact
                assets to secure your business:
              </p>
            </div>
            <ol className="flex flex-col gap-px overflow-hidden rounded-lg border" style={{ backgroundColor: "var(--color-rule)" }}>
              {letterAssets.map((asset, index) => (
                <li className="flex flex-col gap-2 bg-background p-5 sm:flex-row sm:gap-5" key={asset.title}>
                  <span
                    className="tnum grid size-7 shrink-0 place-items-center rounded-md bg-accent-tint text-sm font-semibold text-accent"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-medium tracking-tight">{asset.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{asset.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-base leading-7 text-foreground/90">
              No long-term commitments, no complex setups. Just compliance, handled.
            </p>
          </div>

          {/* Sign-off + CTA */}
          <div className="flex flex-col gap-6 border-t pt-8">
            <div className="flex flex-col gap-1 text-base leading-7 text-foreground/90">
              <p>To secure your compliance pack and train your first 10 employees, click below.</p>
            </div>
            <Button className="h-11 w-fit rounded-full px-6 text-base" size="lg">
              Generate Your Article 4 Compliance Pack &mdash; &euro;199
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Yours sincerely,</p>
              <p className="font-medium tracking-tight">The AIFirst Team</p>
              <p className="text-sm text-muted-foreground">Dublin, Ireland</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function VaultSection() {
  return (
    <section id="vault" className="mx-auto w-[min(94%,72rem)] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <span className="text-sm font-medium text-muted-foreground">Compliance Vault</span>
          <h2 className="display-wrap font-display text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
            One export for the WRC, DPC, sector regulator, or a solicitor letter.
          </h2>
          <p className="max-w-[64ch] text-base leading-7 text-muted-foreground">
            The vault compiles the documents a business should be able to produce: policy,
            register, staff training logs, role mappings, certificates, and refresh evidence.
          </p>
          <div className="flex flex-col gap-3">
            {evidenceItems.map((item) => (
              <div className="flex items-start gap-3" key={item}>
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-tint text-accent">
                  <Check aria-hidden="true" className="size-3" />
                </span>
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="font-display text-lg tracking-tight">
              Article 4 Compliance Package
            </CardTitle>
            <CardDescription>Generated for Riverbank Hospitality Ltd.</CardDescription>
            <CardAction>
              <Badge>Ready</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <VaultTile icon={FileCheck2} label="Policy" value="Version 1.4" />
              <VaultTile icon={ClipboardList} label="AI register" value="4 tools logged" />
              <VaultTile icon={BookOpenCheck} label="Training" value="14 of 18 complete" />
              <VaultTile icon={BadgeCheck} label="Certificates" value="QR verified" />
            </div>
            <Separator />
            <div className="flex flex-col gap-3 rounded-lg bg-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Export coverage</span>
                <span className="tnum text-sm">78%</span>
              </div>
              <Progress value={78}>
                <ProgressLabel className="sr-only">Export coverage</ProgressLabel>
                <ProgressValue className="sr-only" />
              </Progress>
              <p className="text-sm leading-6 text-muted-foreground">
                Missing items: HR module completions and one data sensitivity review.
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <span className="text-sm text-muted-foreground">Last generated: 26 June 2026</span>
            <Button variant="outline">
              Download
              <Download data-icon="inline-end" aria-hidden="true" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

function VaultTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <Icon className="mb-4 size-5 text-accent" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function TrainingSection() {
  return (
    <section id="training" className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="mx-auto grid w-[min(94%,72rem)] grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <span className="text-sm font-medium text-primary-foreground/70">Micro-learning engine</span>
          <h2 className="display-wrap font-display text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
            Short modules, strict evidence, role-specific exposure.
          </h2>
          <p className="max-w-[62ch] text-base leading-7 text-primary-foreground/76">
            Staff enter through a magic link, finish the course on mobile or desktop, pass the
            assessment, and leave an auditable record behind.
          </p>
          <Button className="w-fit rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Preview training
            <Play data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-3">
          {trainingRows.map(([module, audience, duration, status]) => (
            <div
              className="grid grid-cols-1 gap-3 rounded-lg border border-primary-foreground/12 bg-primary-foreground/7 p-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.75fr)_minmax(0,0.55fr)]"
              key={module}
            >
              <div className="min-w-0">
                <p className="font-medium">{module}</p>
                <p className="text-sm text-primary-foreground/70">{audience}</p>
              </div>
              <p className="tnum text-sm text-primary-foreground/82">{duration}</p>
              <Badge className="w-fit border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
                {status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RegisterSection({ registerRows }: { registerRows: RegisterRow[] }) {
  return (
    <section id="risk" className="mx-auto w-[min(94%,72rem)] py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <span className="text-sm font-medium text-muted-foreground">AI Use Register</span>
          <h2 className="display-wrap font-display text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
            The ledger most SMEs do not have yet.
          </h2>
          <p className="max-w-[62ch] text-base leading-7 text-muted-foreground">
            Log each AI tool, who uses it, what data it touches, and which training module applies.
            Risk flags update as the register changes.
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-display text-lg tracking-tight">Live register</CardTitle>
            <CardDescription>
              Mapped to users, data categories, and training status.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[46rem]">
              <div className="grid grid-cols-[0.5fr_1.1fr_1fr_1fr_0.6fr_1.1fr] gap-2 border-b pb-2 text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
                <span className="sr-only">Brand</span>
                <span>Tool</span>
                <span>Use case</span>
                <span>Data</span>
                <span>Risk</span>
                <span>Status</span>
              </div>
              {registerRows.map((row) => (
                <div
                  className="grid grid-cols-[0.5fr_1.1fr_1fr_1fr_0.6fr_1.1fr] items-center gap-2 border-b py-3 text-sm last:border-b-0"
                  key={row.tool}
                >
                  <span className="flex items-center" aria-hidden="true">
                    <ToolMark tool={row} />
                  </span>
                  <span className="min-w-0 font-medium text-foreground">{row.tool}</span>
                  <span className="min-w-0 text-muted-foreground">{row.useCase}</span>
                  <span className="min-w-0 text-muted-foreground">{row.data}</span>
                  <span className="tnum text-xs text-foreground">{row.risk}</span>
                  <span className="min-w-0 text-muted-foreground">{row.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="border-y bg-card/55">
      <div className="mx-auto w-[min(94%,72rem)] py-16 md:py-24">
        <div className="flex max-w-[40ch] flex-col gap-4 pb-10">
          <span className="text-sm font-medium text-muted-foreground">Commercial model</span>
          <h2 className="display-wrap font-display text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
            Start with the audit hook. Expand into the system of record.
          </h2>
        </div>
        <div
          className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: "var(--color-rule)" }}
        >
          <PriceCard name="Panic Button" price="EUR 499" detail="One-time pack for micro-businesses with 10 seats." />
          <PriceCard name="Growing Business" price="EUR 199/mo" detail="Up to 50 staff, register, reminders, and exports." />
          <PriceCard name="Enterprise" price="EUR 499/mo+" detail="SSO, white-label portal, and compliance dashboard." />
          <PriceCard name="CPD White-label" price="Custom" detail="Professional body distribution and accredited modules." />
        </div>
      </div>
    </section>
  )
}

function PriceCard({ name, price, detail }: { name: string; price: string; detail: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 bg-background p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">{name}</h3>
      </div>
      <p className="tnum text-2xl font-semibold">{price}</p>
      <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  )
}

function ClosingCTA() {
  return (
    <section className="mx-auto w-[min(94%,72rem)] py-16 md:py-24">
      <div className="flex flex-col items-start gap-6 rounded-2xl border bg-card p-8 md:p-12">
        <h2 className="display-wrap font-display max-w-[24ch] text-3xl font-semibold tracking-tight md:text-[2.75rem] md:leading-[1.05]">
          Run the check. See the gap. Close it before the regulator does.
        </h2>
        <p className="max-w-[62ch] text-base leading-7 text-muted-foreground">
          The risk check is free and takes under two minutes. The audit pack is what you hand over
          when someone asks to see your Article 4 evidence.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="h-10 rounded-full px-5" size="lg">
            Run risk check
            <Gauge data-icon="inline-end" aria-hidden="true" />
          </Button>
          <Button className="h-10 rounded-full px-5" size="lg" variant="outline">
            Book demo
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-[min(94%,72rem)] flex-col gap-6 py-12 md:py-16">
        <div className="flex max-w-[36ch] flex-col gap-3">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Evidence, not enthusiasm.
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            AIFirst turns AI literacy into audit-ready records for Irish employers under Article 4
            of the EU AI Act.
          </p>
        </div>
        <div className="hairline pt-6" />
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
            </span>
            <span className="font-semibold">AIFirst</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              className="focus-ring rounded-sm hover:text-foreground"
              href="https://artificialintelligenceact.eu/ai-act-explorer/"
              rel="noopener noreferrer"
              target="_blank"
            >
              AI Act Explorer
            </a>
            <a
              className="focus-ring rounded-sm hover:text-foreground"
              href="https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers"
            >
              EU AI Office Q&A
            </a>
            <a
              className="focus-ring rounded-sm hover:text-foreground"
              href="https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99"
            >
              Article 99
            </a>
            <a
              className="focus-ring rounded-sm hover:text-foreground"
              href="https://www.oireachtas.ie/en/bills/bill/2026/69/"
            >
              Irish AI Bill
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
