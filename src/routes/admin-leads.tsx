import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, ChevronDown, ChevronRight, RefreshCw, LogOut } from "lucide-react";
import { listInquiries, updateInquiryStatus, verifyAdmin } from "@/lib/admin.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-leads")({
  component: AdminLeads,
  head: () => ({ meta: [{ title: "Admin Leads" }, { name: "robots", content: "noindex,nofollow" }] }),
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

const STORAGE_KEY = "admin_pw";

function AdminLeads() {
  const [password, setPassword] = useState<string>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) ?? "" : "",
  );
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Inquiry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const verifyFn = useServerFn(verifyAdmin);
  const listFn = useServerFn(listInquiries);
  const updateFn = useServerFn(updateInquiryStatus);

  const load = async (pw: string) => {
    setLoading(true);
    setErr(null);
    try {
      const data = await listFn({ data: { password: pw } });
      setRows(data as Inquiry[]);
      setAuthed(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-attempt if password is already stored
  if (!authed && password && rows === null && !loading && !err) {
    void load(password);
  }

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setErr(null);
    try {
      await verifyFn({ data: { password } });
      sessionStorage.setItem(STORAGE_KEY, password);
      await load(password);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  };

  const onLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword("");
    setAuthed(false);
    setRows(null);
  };

  const onStatusChange = async (id: string, status: string) => {
    const prev = rows;
    setRows((r) => r?.map((i) => (i.id === id ? { ...i, status } : i)) ?? r);
    try {
      await updateFn({
        data: { password, id, status: status as "new" | "contacted" | "in_progress" | "closed" },
      });
      toast.success("Status updated");
    } catch (e) {
      setRows(prev);
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-5">
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-surface/50 p-8 space-y-5"
        >
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight">Admin access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the admin password to view inquiries.
            </p>
          </div>
          <Input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Checking…" : "Unlock"}
          </Button>
        </form>
        <Toaster theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight">Inquiries</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {rows?.length ?? 0} total · newest first
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => load(password)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 w-8"></th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Company</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Budget</th>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows && rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      No inquiries yet.
                    </td>
                  </tr>
                )}
                {rows?.map((r) => {
                  const isOpen = openId === r.id;
                  return (
                    <>
                      <tr
                        key={r.id}
                        className="border-t border-border hover:bg-surface/60 cursor-pointer"
                        onClick={() => setOpenId(isOpen ? null : r.id)}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium">{r.full_name}</td>
                        <td className="px-4 py-3 text-foreground/85">{r.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.company_name || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.service_needed}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.budget_range || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={r.status}
                            onValueChange={(v) => onStatusChange(r.id, v)}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
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
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${r.id}-detail`} className="border-t border-border bg-background/30">
                          <td></td>
                          <td colSpan={7} className="px-4 py-5">
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">
                              Project details
                            </div>
                            <p className="mt-2 text-sm whitespace-pre-wrap text-foreground/90 leading-relaxed">
                              {r.project_details}
                            </p>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster theme="dark" />
    </div>
  );
}
