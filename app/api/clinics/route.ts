import { NextRequest, NextResponse } from "next/server";
import { clinicSearchSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const parsed = clinicSearchSchema.safeParse({ city: request.nextUrl.searchParams.get("city") ?? "" });
  if (!parsed.success) return NextResponse.json({ error: "Provide a city to search." }, { status: 400 });
  try {
    const { data, error } = await getSupabaseAdmin().from("clinics").select("id,name,city,address,phone").ilike("city", `%${parsed.data.city}%`).order("name");
    if (error) throw error;
    return NextResponse.json({ clinics: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to search clinics." }, { status: 500 });
  }
}
