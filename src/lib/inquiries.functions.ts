import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inquirySchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company_name: z.string().max(200).nullable().optional(),
  service_needed: z.string().min(1).max(200),
  budget_range: z.string().max(100).nullable().optional(),
  project_details: z.string().min(1).max(5000),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((d) => inquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.from("inquiries").insert({
      full_name: data.full_name,
      email: data.email,
      company_name: data.company_name ?? null,
      service_needed: data.service_needed,
      budget_range: data.budget_range ?? null,
      project_details: data.project_details,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
