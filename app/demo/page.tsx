import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { Clinic } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  let businesses: Clinic[] = [];
  try {
    const { data } = await getSupabaseAdmin().from("clinics").select("id,name,city,address,phone,neighborhood,category,service_focus,service_description,pricing_note").eq("city", "Oslo").order("category").order("neighborhood");
    businesses = data ?? [];
  } catch { /* The demo list appears after Supabase variables and migration are configured. */ }
  return <main className="agent-business-directory">
    <section className="agent-business-grid" aria-label="AgentProfiles business directory">
      {businesses.map((business) => <article className="agent-business-card" key={business.id}>
        <div className="agent-business-mark">✦</div>
        <h1>{business.name}</h1>
        <p>{business.neighborhood}, Oslo</p>
        <div className="agent-business-rule" />
        <span>{business.address}</span>
      </article>)}
    </section>
  </main>;
}
