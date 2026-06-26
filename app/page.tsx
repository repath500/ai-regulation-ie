"use client"

import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Download,
  Pencil,
  FileText,
  Gauge,
  RotateCcw,
  Trash2,
  Upload,
  Landmark,
  Plus,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState } from "react"

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
import { Input } from "@/components/ui/input"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type RiskCategory = "Minimal" | "Limited" | "High"
type DataSensitivity = "Public" | "Internal" | "Personal" | "Special category"
type RoleCategory = "General" | "HR" | "Marketing" | "Leadership" | "Legal"
type ViewKey = "overview" | "employees" | "register" | "training" | "vault"

type Employee = {
  id: string
  name: string
  email: string
  role: RoleCategory
  assignedModules: string[]
  completedModules: string[]
  score: number
}

type RegisterItem = {
  id: string
  toolName: string
  ownerRole: RoleCategory
  useCase: string
  risk: RiskCategory
  data: DataSensitivity
  employees: string[]
}

type ModuleDefinition = {
  id: string
  title: string
  audience: RoleCategory | "All"
  duration: string
  outcomes: string[]
}

type WorkspaceState = {
  companyName: string
  policyVersion: string
  reviewDate: string
  employees: Employee[]
  register: RegisterItem[]
}

const STORAGE_KEY = "aifirst-workspace-v1"

const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "foundation",
    title: "Generative AI foundations",
    audience: "All",
    duration: "30 min",
    outcomes: [
      "Explain how probabilistic AI tools fail",
      "Identify confidential and personal data risks",
      "Follow internal escalation and acceptable use rules",
    ],
  },
  {
    id: "hr",
    title: "HR and recruitment controls",
    audience: "HR",
    duration: "55 min",
    outcomes: [
      "Handle CV screening and employment decisions safely",
      "Recognize Annex III high-risk triggers",
      "Document human oversight on employment workflows",
    ],
  },
  {
    id: "marketing",
    title: "Marketing and content review",
    audience: "Marketing",
    duration: "40 min",
    outcomes: [
      "Review AI-generated claims before publication",
      "Track IP and disclosure risks",
      "Separate public prompts from internal source material",
    ],
  },
  {
    id: "board",
    title: "Board and executive briefing",
    audience: "Leadership",
    duration: "75 min",
    outcomes: [
      "Exercise meaningful oversight on AI deployment",
      "Review literacy coverage and evidence cadence",
      "Approve policy and refresh decisions",
    ],
  },
]

const defaultState: WorkspaceState = {
  companyName: "Riverbank Hospitality Ltd.",
  policyVersion: "1.4",
  reviewDate: "2026-08-02",
  employees: [
    {
      id: "emp-1",
      name: "Sinead Murphy",
      email: "sinead@riverbank.ie",
      role: "HR",
      assignedModules: ["foundation", "hr"],
      completedModules: ["foundation"],
      score: 82,
    },
    {
      id: "emp-2",
      name: "Tom Breen",
      email: "tom@riverbank.ie",
      role: "Marketing",
      assignedModules: ["foundation", "marketing"],
      completedModules: ["foundation", "marketing"],
      score: 91,
    },
    {
      id: "emp-3",
      name: "Maeve Doyle",
      email: "maeve@riverbank.ie",
      role: "Leadership",
      assignedModules: ["foundation", "board"],
      completedModules: ["foundation"],
      score: 77,
    },
    {
      id: "emp-4",
      name: "Luca Byrne",
      email: "luca@riverbank.ie",
      role: "General",
      assignedModules: ["foundation"],
      completedModules: [],
      score: 0,
    },
  ],
  register: [
    {
      id: "tool-1",
      toolName: "ChatGPT Team",
      ownerRole: "HR",
      useCase: "Drafting staff letters and internal policies",
      risk: "High",
      data: "Personal",
      employees: ["emp-1", "emp-3"],
    },
    {
      id: "tool-2",
      toolName: "Microsoft Copilot",
      ownerRole: "General",
      useCase: "Email summaries and document search",
      risk: "Limited",
      data: "Internal",
      employees: ["emp-2", "emp-4"],
    },
    {
      id: "tool-3",
      toolName: "Canva AI",
      ownerRole: "Marketing",
      useCase: "Campaign copy and image generation",
      risk: "Minimal",
      data: "Public",
      employees: ["emp-2"],
    },
  ],
}

const emptyEmployeeForm = {
  name: "",
  email: "",
  role: "General" as RoleCategory,
}

const emptyRegisterForm = {
  toolName: "",
  useCase: "",
  ownerRole: "General" as RoleCategory,
  risk: "Limited" as RiskCategory,
  data: "Internal" as DataSensitivity,
}

export default function Home() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => readStoredWorkspace())
  const [activeView, setActiveView] = useState<ViewKey>("overview")
  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm)
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    () => readStoredWorkspace().employees[0]?.id ?? ""
  )
  const [editingRegisterId, setEditingRegisterId] = useState<string | null>(null)
  const [selectedRegisterEmployees, setSelectedRegisterEmployees] = useState<string[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
  }, [workspace])

  const totalAssignments = workspace.employees.reduce(
    (total, employee) => total + employee.assignedModules.length,
    0
  )
  const totalCompletions = workspace.employees.reduce(
    (total, employee) => total + employee.completedModules.length,
    0
  )
  const trainingCompletionRate =
    totalAssignments === 0 ? 0 : Math.round((totalCompletions / totalAssignments) * 100)
  const registerCoverageRate =
    workspace.register.length === 0
      ? 0
      : Math.round(
          (workspace.register.filter((item) => item.employees.length > 0).length /
            workspace.register.length) *
            100
        )
  const leadershipCovered = workspace.employees
    .filter((employee) => employee.role === "Leadership")
    .every((employee) => employee.completedModules.includes("board"))
  const policyCurrent = workspace.policyVersion.trim().length > 0 && workspace.reviewDate.length > 0
  const readinessScore = Math.round(
    trainingCompletionRate * 0.45 +
      registerCoverageRate * 0.3 +
      (leadershipCovered ? 15 : 0) +
      (policyCurrent ? 10 : 0)
  )

  const readinessLabel =
    readinessScore >= 80 ? "Audit-ready" : readinessScore >= 60 ? "Close gap" : "Action needed"

  const filteredEmployees = workspace.employees.filter((employee) => {
    const haystack = `${employee.name} ${employee.email} ${employee.role}`.toLowerCase()
    return haystack.includes(search.toLowerCase())
  })

  const selectedEmployee =
    workspace.employees.find((employee) => employee.id === selectedEmployeeId) ?? workspace.employees[0]

  function setCompanyField<K extends keyof WorkspaceState>(field: K, value: WorkspaceState[K]) {
    setWorkspace((current) => ({ ...current, [field]: value }))
  }

  function addEmployee() {
    if (!employeeForm.name.trim() || !employeeForm.email.trim()) {
      return
    }

    const assignedModules = moduleDefinitions
      .filter(
        (module) => module.audience === "All" || module.audience === employeeForm.role
      )
      .map((module) => module.id)

    const newEmployee: Employee = {
      id: createId("emp"),
      name: employeeForm.name.trim(),
      email: employeeForm.email.trim(),
      role: employeeForm.role,
      assignedModules,
      completedModules: [],
      score: 0,
    }

    setWorkspace((current) => ({
      ...current,
      employees: [...current.employees, newEmployee],
    }))
    setSelectedEmployeeId(newEmployee.id)
    setEmployeeForm(emptyEmployeeForm)
  }

  function addRegisterItem() {
    if (!registerForm.toolName.trim() || !registerForm.useCase.trim()) {
      return
    }

    if (editingRegisterId) {
      setWorkspace((current) => ({
        ...current,
        register: current.register.map((item) =>
          item.id === editingRegisterId
            ? {
                ...item,
                toolName: registerForm.toolName.trim(),
                ownerRole: registerForm.ownerRole,
                useCase: registerForm.useCase.trim(),
                risk: registerForm.risk,
                data: registerForm.data,
                employees: selectedRegisterEmployees,
              }
            : item
        ),
      }))
    } else {
      const newItem: RegisterItem = {
        id: createId("tool"),
        toolName: registerForm.toolName.trim(),
        ownerRole: registerForm.ownerRole,
        useCase: registerForm.useCase.trim(),
        risk: registerForm.risk,
        data: registerForm.data,
        employees: selectedRegisterEmployees,
      }

      setWorkspace((current) => ({
        ...current,
        register: [...current.register, newItem],
      }))
    }

    setRegisterForm(emptyRegisterForm)
    setSelectedRegisterEmployees([])
    setEditingRegisterId(null)
  }

  function toggleModuleCompletion(employeeId: string, moduleId: string) {
    setWorkspace((current) => ({
      ...current,
      employees: current.employees.map((employee) => {
        if (employee.id !== employeeId) {
          return employee
        }

        const completedModules = employee.completedModules.includes(moduleId)
          ? employee.completedModules.filter((item) => item !== moduleId)
          : [...employee.completedModules, moduleId]

        const score =
          completedModules.length === 0
            ? 0
            : 70 + Math.round((completedModules.length / employee.assignedModules.length) * 25)

        return {
          ...employee,
          completedModules,
          score,
        }
      }),
    }))
  }

  function toggleRegisterEmployee(employeeId: string) {
    setSelectedRegisterEmployees((current) =>
      current.includes(employeeId)
        ? current.filter((item) => item !== employeeId)
        : [...current, employeeId]
    )
  }

  function updateSelectedEmployee(
    field: "name" | "email" | "role",
    value: string
  ) {
    if (!selectedEmployee) {
      return
    }

    setWorkspace((current) => ({
      ...current,
      employees: current.employees.map((employee) => {
        if (employee.id !== selectedEmployee.id) {
          return employee
        }

        if (field !== "role") {
          return {
            ...employee,
            [field]: value,
          }
        }

        const role = value as RoleCategory
        const assignedModules = moduleDefinitions
          .filter((module) => module.audience === "All" || module.audience === role)
          .map((module) => module.id)
        const completedModules = employee.completedModules.filter((moduleId) =>
          assignedModules.includes(moduleId)
        )
        const score =
          completedModules.length === 0
            ? 0
            : 70 + Math.round((completedModules.length / assignedModules.length) * 25)

        return {
          ...employee,
          role,
          assignedModules,
          completedModules,
          score,
        }
      }),
    }))
  }

  function removeSelectedEmployee() {
    if (!selectedEmployee) {
      return
    }

    setWorkspace((current) => {
      const employees = current.employees.filter((employee) => employee.id !== selectedEmployee.id)
      const register = current.register.map((item) => ({
        ...item,
        employees: item.employees.filter((employeeId) => employeeId !== selectedEmployee.id),
      }))

      return {
        ...current,
        employees,
        register,
      }
    })

    setSelectedEmployeeId((current) => {
      if (current !== selectedEmployee.id) {
        return current
      }

      const fallback = workspace.employees.find((employee) => employee.id !== selectedEmployee.id)
      return fallback?.id ?? ""
    })
  }

  function startEditingRegisterItem(itemId: string) {
    const item = workspace.register.find((entry) => entry.id === itemId)

    if (!item) {
      return
    }

    setEditingRegisterId(item.id)
    setRegisterForm({
      toolName: item.toolName,
      useCase: item.useCase,
      ownerRole: item.ownerRole,
      risk: item.risk,
      data: item.data,
    })
    setSelectedRegisterEmployees(item.employees)
    setActiveView("register")
  }

  function removeRegisterItem(itemId: string) {
    setWorkspace((current) => ({
      ...current,
      register: current.register.filter((item) => item.id !== itemId),
    }))

    if (editingRegisterId === itemId) {
      setEditingRegisterId(null)
      setRegisterForm(emptyRegisterForm)
      setSelectedRegisterEmployees([])
    }
  }

  function resetWorkspace() {
    setWorkspace(defaultState)
    setSelectedEmployeeId(defaultState.employees[0]?.id ?? "")
    setEmployeeForm(emptyEmployeeForm)
    setRegisterForm(emptyRegisterForm)
    setEditingRegisterId(null)
    setSelectedRegisterEmployees([])
    setSearch("")
  }

  function exportWorkspaceSnapshot() {
    const file = new Blob([JSON.stringify(workspace, null, 2)], {
      type: "application/json;charset=utf-8",
    })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${slugify(workspace.companyName)}-workspace.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function importWorkspaceSnapshot(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as WorkspaceState
        if (!parsed.companyName || !Array.isArray(parsed.employees) || !Array.isArray(parsed.register)) {
          throw new Error("Invalid snapshot")
        }
        setWorkspace(parsed)
        setSelectedEmployeeId(parsed.employees[0]?.id ?? "")
        setEditingRegisterId(null)
        setEmployeeForm(emptyEmployeeForm)
        setRegisterForm(emptyRegisterForm)
        setSelectedRegisterEmployees([])
        setSearch("")
      })
      .catch(() => {
        window.alert("Could not import workspace file.")
      })
      .finally(() => {
        event.target.value = ""
      })
  }

  function exportCompliancePack() {
    const content = buildCompliancePack(workspace, {
      readinessScore,
      readinessLabel,
      trainingCompletionRate,
      registerCoverageRate,
      leadershipCovered,
    })

    const file = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(file)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${slugify(workspace.companyName)}-article-4-compliance-pack.md`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b bg-background/92 backdrop-blur">
        <div className="mx-auto flex w-[min(96%,88rem)] items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AIFirst Workspace</p>
              <p className="text-sm text-muted-foreground">Article 4 evidence, training, and register control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={readinessScore >= 80 ? "default" : readinessScore >= 60 ? "secondary" : "destructive"}>
              {readinessLabel}
            </Badge>
            <Button className="rounded-full" onClick={exportCompliancePack}>
              Export pack
              <Download data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[min(96%,88rem)] grid-cols-1 gap-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 border-b pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Company
            </label>
            <Input
              value={workspace.companyName}
              onChange={(event) => setCompanyField("companyName", event.target.value)}
            />
          </div>

          <nav className="flex flex-col gap-1" aria-label="Workspace">
            <SidebarButton
              active={activeView === "overview"}
              icon={Gauge}
              label="Overview"
              onClick={() => setActiveView("overview")}
            />
            <SidebarButton
              active={activeView === "employees"}
              icon={UsersRound}
              label="Employees"
              onClick={() => setActiveView("employees")}
            />
            <SidebarButton
              active={activeView === "register"}
              icon={BriefcaseBusiness}
              label="AI register"
              onClick={() => setActiveView("register")}
            />
            <SidebarButton
              active={activeView === "training"}
              icon={BookOpenCheck}
              label="Training"
              onClick={() => setActiveView("training")}
            />
            <SidebarButton
              active={activeView === "vault"}
              icon={FileText}
              label="Compliance pack"
              onClick={() => setActiveView("vault")}
            />
          </nav>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Readiness score</CardTitle>
              <CardDescription>Derived from training, register coverage, policy metadata, and board literacy.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-3">
                <span className="font-display text-5xl font-semibold tracking-tight">{readinessScore}</span>
                <Badge variant="outline">{readinessLabel}</Badge>
              </div>
              <Progress value={readinessScore}>
                <ProgressLabel className="sr-only">Readiness score</ProgressLabel>
                <ProgressValue className="sr-only" />
              </Progress>
            </CardContent>
          </Card>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {activeView === "overview" ? (
            <OverviewView
              workspace={workspace}
              readinessScore={readinessScore}
              readinessLabel={readinessLabel}
              trainingCompletionRate={trainingCompletionRate}
              registerCoverageRate={registerCoverageRate}
              leadershipCovered={leadershipCovered}
              onExport={exportCompliancePack}
              onOpenEmployees={() => setActiveView("employees")}
              onOpenRegister={() => setActiveView("register")}
            />
          ) : null}

          {activeView === "employees" ? (
            <EmployeesView
              employeeForm={employeeForm}
              filteredEmployees={filteredEmployees}
              search={search}
              selectedEmployee={selectedEmployee}
              setEmployeeForm={setEmployeeForm}
              setSearch={setSearch}
              addEmployee={addEmployee}
              setSelectedEmployeeId={setSelectedEmployeeId}
              toggleModuleCompletion={toggleModuleCompletion}
              updateSelectedEmployee={updateSelectedEmployee}
              removeSelectedEmployee={removeSelectedEmployee}
            />
          ) : null}

          {activeView === "register" ? (
            <RegisterView
              register={workspace.register}
              employees={workspace.employees}
              registerForm={registerForm}
              editingRegisterId={editingRegisterId}
              selectedRegisterEmployees={selectedRegisterEmployees}
              setRegisterForm={setRegisterForm}
              toggleRegisterEmployee={toggleRegisterEmployee}
              addRegisterItem={addRegisterItem}
              startEditingRegisterItem={startEditingRegisterItem}
              removeRegisterItem={removeRegisterItem}
            />
          ) : null}

          {activeView === "training" ? (
            <TrainingView employees={workspace.employees} />
          ) : null}

          {activeView === "vault" ? (
            <VaultView
              workspace={workspace}
              readinessScore={readinessScore}
              readinessLabel={readinessLabel}
              trainingCompletionRate={trainingCompletionRate}
              registerCoverageRate={registerCoverageRate}
              leadershipCovered={leadershipCovered}
              onExport={exportCompliancePack}
              setCompanyField={setCompanyField}
              onExportSnapshot={exportWorkspaceSnapshot}
              onImportSnapshot={importWorkspaceSnapshot}
              onResetWorkspace={resetWorkspace}
            />
          ) : null}
        </div>
      </div>
    </main>
  )
}

function OverviewView({
  workspace,
  readinessScore,
  readinessLabel,
  trainingCompletionRate,
  registerCoverageRate,
  leadershipCovered,
  onExport,
  onOpenEmployees,
  onOpenRegister,
}: {
  workspace: WorkspaceState
  readinessScore: number
  readinessLabel: string
  trainingCompletionRate: number
  registerCoverageRate: number
  leadershipCovered: boolean
  onExport: () => void
  onOpenEmployees: () => void
  onOpenRegister: () => void
}) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <Badge className="w-fit" variant="outline">
            Working MVP
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-[clamp(2.25rem,3vw+1rem,4rem)] font-semibold leading-[1.02] tracking-tight">
              Control the AI register, assign training, and export evidence.
            </h1>
            <p className="max-w-[65ch] text-base leading-7 text-muted-foreground">
              This workspace tracks who uses which AI tools, what data they touch, which modules they
              must complete, and whether your company could answer an Article 4 evidence request today.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onExport}>
              Download compliance pack
              <Download data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button variant="outline" onClick={onOpenEmployees}>
              Review training gaps
              <ChevronRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{workspace.companyName}</CardTitle>
            <CardDescription>Current readiness derived from live workspace data.</CardDescription>
            <CardAction>
              <Badge variant={readinessScore >= 80 ? "default" : readinessScore >= 60 ? "secondary" : "destructive"}>
                {readinessLabel}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard icon={UsersRound} label="Employees" value={String(workspace.employees.length)} />
            <MetricCard icon={BriefcaseBusiness} label="AI tools" value={String(workspace.register.length)} />
            <MetricCard icon={BookOpenCheck} label="Training" value={`${trainingCompletionRate}%`} />
            <MetricCard icon={ShieldCheck} label="Readiness" value={`${readinessScore}/100`} />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Training coverage</CardTitle>
            <CardDescription>Assigned module completion across the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <span className="font-display text-4xl font-semibold">{trainingCompletionRate}%</span>
              <BookOpenCheck className="text-primary" aria-hidden="true" />
            </div>
            <Progress value={trainingCompletionRate}>
              <ProgressLabel className="sr-only">Training coverage</ProgressLabel>
              <ProgressValue className="sr-only" />
            </Progress>
          </CardContent>
          <CardFooter>
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onOpenEmployees} type="button">
              Open employee tracking
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register coverage</CardTitle>
            <CardDescription>Tools mapped to named employees and use cases.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <span className="font-display text-4xl font-semibold">{registerCoverageRate}%</span>
              <BriefcaseBusiness className="text-primary" aria-hidden="true" />
            </div>
            <Progress value={registerCoverageRate}>
              <ProgressLabel className="sr-only">Register coverage</ProgressLabel>
              <ProgressValue className="sr-only" />
            </Progress>
          </CardContent>
          <CardFooter>
            <button className="text-sm text-muted-foreground hover:text-foreground" onClick={onOpenRegister} type="button">
              Open AI register
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Board literacy</CardTitle>
            <CardDescription>Leadership oversight and briefing coverage.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <span className="font-display text-4xl font-semibold">
                {leadershipCovered ? "Covered" : "Pending"}
              </span>
              {leadershipCovered ? (
                <BadgeCheck className="text-[var(--color-success)]" aria-hidden="true" />
              ) : (
                <AlertTriangle className="text-[var(--color-warning)]" aria-hidden="true" />
              )}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Board members need enough literacy to exercise meaningful oversight on deployed AI systems.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Immediate gaps</CardTitle>
            <CardDescription>The next items keeping this workspace from an audit-ready state.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <GapRow
              label="Unfinished assigned modules"
              value={String(
                workspace.employees.reduce(
                  (count, employee) => count + employee.assignedModules.length - employee.completedModules.length,
                  0
                )
              )}
            />
            <GapRow
              label="High-risk register items"
              value={String(workspace.register.filter((item) => item.risk === "High").length)}
            />
            <GapRow
              label="Employees without any completion"
              value={String(workspace.employees.filter((employee) => employee.completedModules.length === 0).length)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence generated here</CardTitle>
            <CardDescription>What the current export will include.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <EvidenceTile icon={FileText} label="Policy metadata" />
            <EvidenceTile icon={BriefcaseBusiness} label="AI tool register" />
            <EvidenceTile icon={ClipboardCheck} label="Training logs" />
            <EvidenceTile icon={Landmark} label="Leadership oversight record" />
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function EmployeesView({
  employeeForm,
  filteredEmployees,
  search,
  selectedEmployee,
  setEmployeeForm,
  setSearch,
  addEmployee,
  setSelectedEmployeeId,
  toggleModuleCompletion,
  updateSelectedEmployee,
  removeSelectedEmployee,
}: {
  employeeForm: typeof emptyEmployeeForm
  filteredEmployees: Employee[]
  search: string
  selectedEmployee?: Employee
  setEmployeeForm: Dispatch<SetStateAction<typeof emptyEmployeeForm>>
  setSearch: Dispatch<SetStateAction<string>>
  addEmployee: () => void
  setSelectedEmployeeId: (employeeId: string) => void
  toggleModuleCompletion: (employeeId: string, moduleId: string) => void
  updateSelectedEmployee: (field: "name" | "email" | "role", value: string) => void
  removeSelectedEmployee: () => void
}) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add employee</CardTitle>
            <CardDescription>Assign role-based modules immediately on creation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Full name"
              value={employeeForm.name}
              onChange={(event) =>
                setEmployeeForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder="Email address"
              value={employeeForm.email}
              onChange={(event) =>
                setEmployeeForm((current) => ({ ...current, email: event.target.value }))
              }
            />
            <select
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={employeeForm.role}
              onChange={(event) =>
                setEmployeeForm((current) => ({
                  ...current,
                  role: event.target.value as RoleCategory,
                }))
              }
            >
              {(["General", "HR", "Marketing", "Leadership", "Legal"] as RoleCategory[]).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <span className="text-sm text-muted-foreground">Foundation is assigned automatically.</span>
            <Button onClick={addEmployee}>
              Add employee
              <Plus data-icon="inline-end" aria-hidden="true" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee register</CardTitle>
            <CardDescription>Search and select a person to update their literacy record.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Search employees" value={search} onChange={(event) => setSearch(event.target.value)} />
            <div className="grid gap-2">
              {filteredEmployees.map((employee) => {
                const completion = employee.assignedModules.length === 0
                  ? 0
                  : Math.round((employee.completedModules.length / employee.assignedModules.length) * 100)

                return (
                  <button
                    key={employee.id}
                    type="button"
                    className={cn(
                      "focus-ring flex items-center justify-between rounded-lg border px-3 py-3 text-left transition-[background-color,border-color,color]",
                      selectedEmployee?.id === employee.id ? "border-ring bg-secondary" : "hover:bg-secondary/50"
                    )}
                    onClick={() => setSelectedEmployeeId(employee.id)}
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{employee.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{employee.role}</Badge>
                      <span className="font-display text-lg font-semibold">{completion}%</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {selectedEmployee ? (
        <Card>
          <CardHeader>
            <CardTitle>{selectedEmployee.name}</CardTitle>
            <CardDescription>
              Mark modules complete to update the employee’s evidence record.
            </CardDescription>
            <CardAction>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedEmployee.role}</Badge>
                <button
                  className="focus-ring inline-flex h-8 items-center justify-center rounded-lg border px-2 text-sm text-muted-foreground transition-[background-color,color] hover:bg-secondary hover:text-foreground"
                  onClick={removeSelectedEmployee}
                  type="button"
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-3">
              <Input
                value={selectedEmployee.name}
                onChange={(event) => updateSelectedEmployee("name", event.target.value)}
              />
              <Input
                value={selectedEmployee.email}
                onChange={(event) => updateSelectedEmployee("email", event.target.value)}
              />
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={selectedEmployee.role}
                onChange={(event) => updateSelectedEmployee("role", event.target.value)}
              >
                {(["General", "HR", "Marketing", "Leadership", "Legal"] as RoleCategory[]).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {moduleDefinitions
              .filter((module) => selectedEmployee.assignedModules.includes(module.id))
              .map((module) => {
                const completed = selectedEmployee.completedModules.includes(module.id)

                return (
                  <button
                    key={module.id}
                    type="button"
                    className={cn(
                      "focus-ring flex flex-col gap-3 rounded-lg border p-4 text-left transition-[background-color,border-color,color]",
                      completed ? "border-[var(--color-success)] bg-[color-mix(in_oklch,var(--color-success),white_92%)]" : "hover:bg-secondary/55"
                    )}
                    onClick={() => toggleModuleCompletion(selectedEmployee.id, module.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                      <Badge variant={completed ? "default" : "outline"}>
                        {completed ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                    <div className="grid gap-1">
                      {module.outcomes.map((outcome) => (
                        <p key={outcome} className="text-sm leading-6 text-muted-foreground">
                          {outcome}
                        </p>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}

function RegisterView({
  register,
  employees,
  registerForm,
  editingRegisterId,
  selectedRegisterEmployees,
  setRegisterForm,
  toggleRegisterEmployee,
  addRegisterItem,
  startEditingRegisterItem,
  removeRegisterItem,
}: {
  register: RegisterItem[]
  employees: Employee[]
  registerForm: typeof emptyRegisterForm
  editingRegisterId: string | null
  selectedRegisterEmployees: string[]
  setRegisterForm: Dispatch<SetStateAction<typeof emptyRegisterForm>>
  toggleRegisterEmployee: (employeeId: string) => void
  addRegisterItem: () => void
  startEditingRegisterItem: (itemId: string) => void
  removeRegisterItem: (itemId: string) => void
}) {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Register AI tool</CardTitle>
            <CardDescription>Capture use case, data sensitivity, owner role, and affected staff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Tool name"
              value={registerForm.toolName}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, toolName: event.target.value }))
              }
            />
            <textarea
              className="min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Primary use case"
              value={registerForm.useCase}
              onChange={(event) =>
                setRegisterForm((current) => ({ ...current, useCase: event.target.value }))
              }
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={registerForm.ownerRole}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    ownerRole: event.target.value as RoleCategory,
                  }))
                }
              >
                {(["General", "HR", "Marketing", "Leadership", "Legal"] as RoleCategory[]).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={registerForm.risk}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    risk: event.target.value as RiskCategory,
                  }))
                }
              >
                {(["Minimal", "Limited", "High"] as RiskCategory[]).map((risk) => (
                  <option key={risk} value={risk}>
                    {risk}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={registerForm.data}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    data: event.target.value as DataSensitivity,
                  }))
                }
              >
                {(["Public", "Internal", "Personal", "Special category"] as DataSensitivity[]).map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {editingRegisterId ? "Editing existing tool entry." : "Assign the people affected below before saving."}
            </span>
            <Button onClick={addRegisterItem}>
              {editingRegisterId ? "Update tool" : "Save tool"}
              {editingRegisterId ? (
                <Pencil data-icon="inline-end" aria-hidden="true" />
              ) : (
                <Plus data-icon="inline-end" aria-hidden="true" />
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign affected staff</CardTitle>
            <CardDescription>Map the tool to named employees for audit evidence.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {employees.map((employee) => {
              const active = selectedRegisterEmployees.includes(employee.id)

              return (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => toggleRegisterEmployee(employee.id)}
                  className={cn(
                    "focus-ring flex items-center justify-between rounded-lg border px-3 py-3 text-left transition-[background-color,border-color]",
                    active ? "border-ring bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                  <Badge variant={active ? "default" : "outline"}>{active ? "Included" : "Optional"}</Badge>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Current AI register</CardTitle>
          <CardDescription>Live list of systems, risks, data classes, and mapped staff.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {register.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-3 rounded-lg border p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)]">
              <div className="min-w-0">
                <p className="font-medium">{item.toolName}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.useCase}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Badge variant="outline">{item.ownerRole}</Badge>
                <Badge variant="outline">{item.data}</Badge>
                <Badge variant={item.risk === "High" ? "destructive" : item.risk === "Limited" ? "secondary" : "outline"}>
                  {item.risk}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{item.employees.length} mapped employee{item.employees.length === 1 ? "" : "s"}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="focus-ring inline-flex h-8 items-center gap-2 rounded-lg border px-2 text-sm transition-[background-color,color] hover:bg-secondary"
                    onClick={() => startEditingRegisterItem(item.id)}
                    type="button"
                  >
                    <Pencil aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    className="focus-ring inline-flex h-8 items-center gap-2 rounded-lg border px-2 text-sm transition-[background-color,color] hover:bg-secondary"
                    onClick={() => removeRegisterItem(item.id)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

function TrainingView({ employees }: { employees: Employee[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Module coverage</CardTitle>
          <CardDescription>Completion counts by module across the current workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {moduleDefinitions.map((module) => {
            const assignedEmployees = employees.filter((employee) =>
              employee.assignedModules.includes(module.id)
            )
            const completedCount = assignedEmployees.filter((employee) =>
              employee.completedModules.includes(module.id)
            ).length
            const coverage =
              assignedEmployees.length === 0
                ? 0
                : Math.round((completedCount / assignedEmployees.length) * 100)

            return (
              <div key={module.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{module.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {module.audience === "All" ? "All employees" : `${module.audience} audience`} · {module.duration}
                    </p>
                  </div>
                  <span className="font-display text-2xl font-semibold">{coverage}%</span>
                </div>
                <Progress className="mt-4" value={coverage}>
                  <ProgressLabel className="sr-only">{module.title}</ProgressLabel>
                  <ProgressValue className="sr-only" />
                </Progress>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lowest coverage employees</CardTitle>
          <CardDescription>People most likely to weaken the evidence file today.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[...employees]
            .sort(
              (left, right) =>
                left.completedModules.length / left.assignedModules.length -
                right.completedModules.length / right.assignedModules.length
            )
            .slice(0, 5)
            .map((employee) => {
              const outstanding = employee.assignedModules.filter(
                (module) => !employee.completedModules.includes(module)
              )

              return (
                <div key={employee.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                    <Badge variant={outstanding.length === 0 ? "default" : "secondary"}>
                      {outstanding.length === 0 ? "Clear" : `${outstanding.length} open`}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Outstanding modules:{" "}
                    {outstanding
                      .map((moduleId) => moduleDefinitions.find((module) => module.id === moduleId)?.title)
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </p>
                </div>
              )
            })}
        </CardContent>
      </Card>
    </section>
  )
}

function VaultView({
  workspace,
  readinessScore,
  readinessLabel,
  trainingCompletionRate,
  registerCoverageRate,
  leadershipCovered,
  onExport,
  setCompanyField,
  onExportSnapshot,
  onImportSnapshot,
  onResetWorkspace,
}: {
  workspace: WorkspaceState
  readinessScore: number
  readinessLabel: string
  trainingCompletionRate: number
  registerCoverageRate: number
  leadershipCovered: boolean
  onExport: () => void
  setCompanyField: <K extends keyof WorkspaceState>(field: K, value: WorkspaceState[K]) => void
  onExportSnapshot: () => void
  onImportSnapshot: (event: React.ChangeEvent<HTMLInputElement>) => void
  onResetWorkspace: () => void
}) {
  const reportSections = [
    {
      label: "Policy metadata",
      body: `Version ${workspace.policyVersion || "missing"} · Next review ${workspace.reviewDate || "missing"}`,
    },
    {
      label: "Training log summary",
      body: `${trainingCompletionRate}% assigned module completion across ${workspace.employees.length} employees`,
    },
    {
      label: "Register summary",
      body: `${workspace.register.length} tools logged · ${registerCoverageRate}% mapped to named staff`,
    },
    {
      label: "Leadership oversight",
      body: leadershipCovered ? "Board literacy briefing recorded" : "Board literacy briefing still pending",
    },
  ]

  return (
    <>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Compliance pack settings</CardTitle>
            <CardDescription>These fields are included in the export metadata.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Policy version"
              value={workspace.policyVersion}
              onChange={(event) => setCompanyField("policyVersion", event.target.value)}
            />
            <Input
              type="date"
              value={workspace.reviewDate}
              onChange={(event) => setCompanyField("reviewDate", event.target.value)}
            />
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Badge variant={readinessScore >= 80 ? "default" : readinessScore >= 60 ? "secondary" : "destructive"}>
              {readinessLabel}
            </Badge>
            <Button onClick={onExport}>
              Download markdown pack
              <Download data-icon="inline-end" aria-hidden="true" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pack preview</CardTitle>
            <CardDescription>The export compiles current workspace state into a regulator-ready summary.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {reportSections.map((section) => (
              <div key={section.label} className="rounded-lg border p-4">
                <p className="font-medium">{section.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Workspace backup</CardTitle>
          <CardDescription>Move this company dataset between browsers without losing the app state.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={onExportSnapshot}>
              Export workspace JSON
              <Download data-icon="inline-end" aria-hidden="true" />
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-[background-color,color] hover:bg-secondary">
              <Upload aria-hidden="true" />
              Import workspace JSON
              <input className="hidden" type="file" accept="application/json" onChange={onImportSnapshot} />
            </label>
          </div>
          <Button variant="outline" onClick={onResetWorkspace}>
            Reset demo data
            <RotateCcw data-icon="inline-end" aria-hidden="true" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export contents</CardTitle>
          <CardDescription>The download includes all records below in markdown form.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <EvidenceTile icon={Building2} label="Company and policy metadata" />
          <EvidenceTile icon={UsersRound} label="Employee literacy records" />
          <EvidenceTile icon={BriefcaseBusiness} label="AI register with risk and data mapping" />
          <EvidenceTile icon={Sparkles} label="Readiness findings and next actions" />
        </CardContent>
      </Card>
    </>
  )
}

function SidebarButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: typeof Gauge
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm transition-[background-color,color]",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      )}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <Icon className="mb-6 text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function GapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-semibold">{value}</span>
    </div>
  )
}

function EvidenceTile({
  icon: Icon,
  label,
}: {
  icon: typeof Gauge
  label: string
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <Icon className="mb-4 text-primary" aria-hidden="true" />
      <p className="text-sm leading-6">{label}</p>
    </div>
  )
}

function buildCompliancePack(
  workspace: WorkspaceState,
  metrics: {
    readinessScore: number
    readinessLabel: string
    trainingCompletionRate: number
    registerCoverageRate: number
    leadershipCovered: boolean
  }
) {
  const employeeLines = workspace.employees
    .map((employee) => {
      const assigned = employee.assignedModules
        .map((moduleId) => moduleDefinitions.find((module) => module.id === moduleId)?.title)
        .filter(Boolean)
        .join(", ")
      const completed = employee.completedModules
        .map((moduleId) => moduleDefinitions.find((module) => module.id === moduleId)?.title)
        .filter(Boolean)
        .join(", ")

      return `- ${employee.name} (${employee.role}) · ${employee.email}
  - Assigned: ${assigned || "None"}
  - Completed: ${completed || "None"}
  - Score: ${employee.score}`
    })
    .join("\n")

  const registerLines = workspace.register
    .map((item) => {
      const mappedEmployees = item.employees
        .map((employeeId) => workspace.employees.find((employee) => employee.id === employeeId)?.name)
        .filter(Boolean)
        .join(", ")

      return `- ${item.toolName}
  - Use case: ${item.useCase}
  - Owner role: ${item.ownerRole}
  - Risk: ${item.risk}
  - Data sensitivity: ${item.data}
  - Mapped employees: ${mappedEmployees || "None"}`
    })
    .join("\n")

  return `# Article 4 Compliance Pack

## Company
- Name: ${workspace.companyName}
- Policy version: ${workspace.policyVersion || "Missing"}
- Next review date: ${workspace.reviewDate || "Missing"}

## Readiness
- Score: ${metrics.readinessScore}/100
- Status: ${metrics.readinessLabel}
- Training completion: ${metrics.trainingCompletionRate}%
- Register coverage: ${metrics.registerCoverageRate}%
- Board literacy covered: ${metrics.leadershipCovered ? "Yes" : "No"}

## Employees
${employeeLines}

## AI Register
${registerLines}

## Required modules
${moduleDefinitions
  .map(
    (module) => `- ${module.title} (${module.duration}) · Audience: ${module.audience}
  - Outcomes: ${module.outcomes.join("; ")}`
  )
  .join("\n")}

## Immediate next actions
- Finish all incomplete assigned modules.
- Confirm all high-risk tools have named owners and mapped employees.
- Keep the policy version and review cadence current.
- Maintain board briefing evidence when leadership uses or oversees AI deployments.
`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function readStoredWorkspace() {
  if (typeof window === "undefined") {
    return defaultState
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return defaultState
  }

  try {
    return JSON.parse(saved) as WorkspaceState
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return defaultState
  }
}
