import { notFound } from "next/navigation";
import { ClinicPage } from "@/components/clinic-page";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data } = await getSupabaseAdmin().from("clinics").select("id,name,city,address,phone,neighborhood,category,service_focus,service_description,pricing_note").eq("id", id).maybeSingle();
    if (!data) notFound();
    return <ClinicPage clinic={data} />;
  } catch { notFound(); }
}
