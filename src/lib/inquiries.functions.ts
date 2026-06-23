import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

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
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
    const { error } = await supabase.from("inquiries").insert({
      full_name: data.full_name,
      email: data.email,
      company_name: data.company_name ?? null,
      service_needed: data.service_needed,
      budget_range: data.budget_range ?? null,
      project_details: data.project_details,
    });
    if (error) {
      console.error("[submitInquiry] insert error:", error);
      throw new Error(error.message);
    }
    return { ok: true };
  });
