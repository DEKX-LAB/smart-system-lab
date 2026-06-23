import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Download, Lock, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  listInquiries,
  updateInquiryStatus,
  verifyAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin-leads")({
  component: AdminLeads,
});

type Inquiry = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  company_name: string | null;
  service_needed: string;
  budget_range: string | null;
  project_details: string;
  status: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

const STORAGE_KEY = "admin_pwd";

function AdminLeads() {
  const [password, setPassword] = useState<string | null>(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem(STORAGE_KEY),
  );

  if (!password) {
    return (
      <PasswordGate
        onAuth={(pwd) => {
          sessionStorage.setItem(STORAGE_KEY, pwd);
          setPassword(pwd);
        }}
      />
    );
  }

  return (
    <>
      <Dashboard
        password={password}
        onLogout={() => {
          sessionStorage.removeItem(STORAGE_KEY);
          setPassword(null);
        }}
      />
      <Toaster theme="dark" />
    </>
  );
}

function PasswordGate({ onAuth }: { onAuth: (pwd: string) => void }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verify = useServerFn(verifyAdmin);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verify({ data: { password: value } });
      onAuth(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface/40 p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg">Admin Access</h1>
            <p className="text-xs text-muted-foreground">Password required</p>
          </div>
        </div>
        <Input
          type="password"
          placeholder="Enter admin password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </div>
  );
}

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listInquiries);
  const update = useServerFn(updateInquiryStatus);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => (await list({ data: { password } })) as Inquiry[],
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: Inquiry["status"] }) =>
      update({ data: { password, ...vars } }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["inquiries"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Update failed"),
  });

  const filtered = (data ?? []).filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    if (dateFrom && new Date(row.created_at) < new Date(dateFrom)) return false;
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (new Date(row.created_at) > end) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = `${row.full_name} ${row.email} ${row.company_name ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = [
      "Submitted", "Full Name", "Email", "Company", "Service", "Budget", "Status", "Project Details",
    ];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filtered.map((r) => [
      new Date(r.created_at).toISOString(),
      r.full_name,
      r.email,
      r.company_name ?? "",
      r.service_needed,
      r.budget_range ?? "",
      r.status,
      r.project_details,
    ].map(escape).join(","));
    const csv = [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Error"}
          </p>
          <Button onClick={onLogout} variant="outline">
            Re-enter password
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight">
              Inquiries
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {data ? `${filtered.length} of ${data.length} total` : "Loading…"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_180px_160px_160px] mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search name, email, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} aria-label="From date" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="To date" />
        </div>

        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading inquiries…</div>
        ) : !filtered.length ? (
          <div className="rounded-xl border border-border bg-surface/40 p-12 text-center text-muted-foreground">
            {data?.length ? "No inquiries match your filters." : "No inquiries yet."}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface/40 overflow-hidden">
            <div className="hidden md:grid grid-cols-[28px_1.3fr_1.5fr_1fr_1.4fr_1fr_1fr_140px] gap-3 px-4 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border bg-background/40">
              <span />
              <span>Name</span>
              <span>Email</span>
              <span>Company</span>
              <span>Service</span>
              <span>Budget</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-border">
              {data.map((row) => {
                const isOpen = expanded === row.id;
                return (
                  <li key={row.id}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : row.id)}
                      className="w-full text-left grid grid-cols-[28px_1fr] md:grid-cols-[28px_1.3fr_1.5fr_1fr_1.4fr_1fr_1fr_140px] gap-3 px-4 py-3.5 text-sm hover:bg-surface/60 transition-colors items-center"
                    >
                      <span className="text-muted-foreground">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                      <span className="font-medium truncate">{row.full_name}</span>
                      <span className="hidden md:block text-muted-foreground truncate">
                        {row.email}
                      </span>
                      <span className="hidden md:block text-muted-foreground truncate">
                        {row.company_name || "—"}
                      </span>
                      <span className="hidden md:block text-muted-foreground truncate">
                        {row.service_needed}
                      </span>
                      <span className="hidden md:block text-muted-foreground truncate">
                        {row.budget_range || "—"}
                      </span>
                      <span className="hidden md:block text-muted-foreground text-xs">
                        {new Date(row.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span
                        className="hidden md:block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={row.status}
                          onValueChange={(v) =>
                            mutation.mutate({
                              id: row.id,
                              status: v as Inquiry["status"],
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 pt-1 md:pl-12 bg-background/30 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3 text-xs md:hidden">
                          <Field k="Email" v={row.email} />
                          <Field k="Company" v={row.company_name || "—"} />
                          <Field k="Service" v={row.service_needed} />
                          <Field k="Budget" v={row.budget_range || "—"} />
                          <Field
                            k="Submitted"
                            v={new Date(row.created_at).toLocaleString()}
                          />
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              Status
                            </span>
                            <Select
                              value={row.status}
                              onValueChange={(v) =>
                                mutation.mutate({
                                  id: row.id,
                                  status: v as Inquiry["status"],
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                            Project details
                          </p>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                            {row.project_details}
                          </p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">
        {k}
      </span>
      <span className="text-foreground/90 break-all">{v}</span>
    </div>
  );
}
