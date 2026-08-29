import { HomePage } from "@/components/home-page";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { Clinic } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let clinics: Clinic[] = [];
  try { const { data } = await getSupabaseAdmin().from("clinics").select("id,name,city,address,phone").order("city"); clinics = data ?? []; } catch { /* Setup instructions are shown by the empty state until env vars exist. */ }
  return <HomePage initialClinics={clinics} />;
}
