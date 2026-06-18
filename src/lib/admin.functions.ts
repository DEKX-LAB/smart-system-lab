import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const passwordSchema = z.object({ password: z.string().min(1) });

function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Admin password not configured");
  if (password !== expected) {
    throw new Error("Invalid password");
  }
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => passwordSchema.parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });

export const listInquiries = createServerFn({ method: "POST" })
  .inputValidator((d) => passwordSchema.parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const updateInquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: z.string().min(1),
        id: z.string().uuid(),
        status: z.enum(["new", "contacted", "in_progress", "closed"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
