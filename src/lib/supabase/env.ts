import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().default("placeholder-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional().default("placeholder-service-key"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000")
});

export function getSupabaseEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.warn("Supabase env validation warning:", parsed.error);
  }
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  };
}
