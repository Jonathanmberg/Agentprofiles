"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingForm } from "@/components/booking-form";
import { AgentActivityPanel } from "@/components/agent-activity";
import type { AppointmentConfirmation, Availability, Clinic } from "@/lib/types";

const displayDate = (iso: string) => new Intl.DateTimeFormat("en-NO", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Oslo" }).format(new Date(iso));

export function ClinicPage({ clinic }: { clinic: Clinic }) {
  const [slots, setSlots] = useState<Availability[]>([]); const [selected, setSelected] = useState<Availability | null>(null); const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null); const [loading, setLoading] = useState(true);
  const dateRange = useMemo(() => { const start = new Date(); const end = new Date(); end.setDate(end.getDate() + 14); return { start: start.toISOString(), end: end.toISOString() }; }, []);
  useEffect(() => { fetch(`/api/availability?clinic_id=${clinic.id}&date_from=${encodeURIComponent(dateRange.start)}&date_to=${encodeURIComponent(dateRange.end)}`).then((r) => r.json()).then((data) => setSlots(data.slots ?? [])).finally(() => setLoading(false)); }, [clinic.id, dateRange]);
  useEffect(() => { const listener = (event: Event) => setConfirmation((event as CustomEvent<AppointmentConfirmation>).detail); window.addEventListener("dentalbookings:confirmation", listener); return () => window.removeEventListener("dentalbookings:confirmation", listener); }, []);
  function booked(value: AppointmentConfirmation) { setConfirmation(value); setSlots((current) => current.filter((slot) => slot.id !== value.slot_id)); setSelected(null); }
  return <main className="shell page-grid"><section>
    <a className="back" href="/">← All clinics</a><div className="clinic-heading"><div className="clinic-monogram">{clinic.name.slice(0, 1)}</div><div><div className="eyebrow">TRUSTED CLINIC · {clinic.city.toUpperCase()}</div><h1>{clinic.name}</h1><p>{clinic.address} · {clinic.phone}</p></div></div>
    {confirmation && <section className="confirmation"><span>✓</span><div><div className="eyebrow">BOOKED THROUGH YOUR AGENT</div><h2>Appointment confirmed</h2><p><strong>{confirmation.dentist_name}</strong> · {displayDate(confirmation.start_time)}</p><p>{confirmation.clinic_name}, {confirmation.clinic_address}</p></div></section>}
    <section><div className="section-heading"><div><div className="eyebrow">NEXT 14 DAYS</div><h2>Open appointments</h2></div><span className="slot-count">{slots.length} open</span></div>
      {loading ? <p className="muted">Finding available appointment times…</p> : slots.length === 0 ? <div className="empty-state">No open slots are left in this two-week window.</div> : <div className="slot-grid">{slots.map((slot) => <button className={`slot ${selected?.id === slot.id ? "selected" : ""}`} onClick={() => setSelected(slot)} key={slot.id}><strong>{displayDate(slot.start_time)}</strong><span>{slot.dentist.name}</span><span>45 minute visit</span></button>)}</div>}
    </section>
    {selected && <section className="booking-card"><div><div className="eyebrow">SELECTED APPOINTMENT</div><h2>{displayDate(selected.start_time)}</h2><p>{selected.dentist.name} · {clinic.name}</p></div><BookingForm slot={selected} onBooked={booked} /></section>}
  </section><AgentActivityPanel /></main>;
}
