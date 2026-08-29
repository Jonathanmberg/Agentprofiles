import { NextRequest, NextResponse } from "next/server";
import { businessSearchSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const parsed = businessSearchSchema.safeParse({
    city: request.nextUrl.searchParams.get("city") ?? "",
    category: request.nextUrl.searchParams.get("category") ?? undefined,
    service: request.nextUrl.searchParams.get("service") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Provide a city to search." }, { status: 400 });
  try {
    let query = getSupabaseAdmin().from("clinics").select("id,name,city,address,phone,neighborhood,category,service_focus,service_description,pricing_note").ilike("city", `%${parsed.data.city}%`);
    if (parsed.data.category) query = query.eq("category", parsed.data.category);
    if (parsed.data.service) query = query.contains("service_focus", [parsed.data.service.toLowerCase()]);
    const { data, error } = await query.order("name");
    if (error) throw error;
    return NextResponse.json({ clinics: data, businesses: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to search clinics." }, { status: 500 });
  }
}
