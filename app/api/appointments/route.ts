import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/schemas";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Provide a valid slot and patient contact details." }, { status: 400 });
  try {
    const { data, error } = await getSupabaseAdmin().rpc("book_open_slot", parsed.data);
    if (error) {
      const status = error.message.includes("no longer available") ? 409 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json({ confirmation: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create booking." }, { status: 500 });
  }
}
