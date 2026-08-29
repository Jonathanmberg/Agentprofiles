import { NextRequest, NextResponse } from "next/server";
import { availabilitySchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const parsed = availabilitySchema.safeParse({
    clinic_id: request.nextUrl.searchParams.get("clinic_id"),
    date_from: request.nextUrl.searchParams.get("date_from"),
    date_to: request.nextUrl.searchParams.get("date_to"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Provide a clinic ID and valid ISO date range." }, { status: 400 });
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("slots")
      .select("id,dentist_id,start_time,end_time,is_booked,dentists!inner(id,clinic_id,name,clinics!inner(id,name,city,address,phone))")
      .eq("dentists.clinic_id", parsed.data.clinic_id)
      .eq("is_booked", false)
      .gte("start_time", parsed.data.date_from)
      .lte("start_time", parsed.data.date_to)
      .order("start_time");
    if (error) throw error;
    const slots = (data ?? []).map((slot: any) => ({
      id: slot.id, dentist_id: slot.dentist_id, start_time: slot.start_time, end_time: slot.end_time, is_booked: slot.is_booked,
      dentist: { id: slot.dentists.id, clinic_id: slot.dentists.clinic_id, name: slot.dentists.name }, clinic: slot.dentists.clinics,
    }));
    return NextResponse.json({ slots, summary: `${slots.length} open appointment options in the requested range.` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to fetch availability." }, { status: 500 });
  }
}
