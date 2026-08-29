"use client";

import { useState } from "react";
import type { AppointmentConfirmation, Availability } from "@/lib/types";

export function BookingForm({ slot, onBooked }: { slot: Availability; onBooked: (value: AppointmentConfirmation) => void }) {
  const [pending, setPending] = useState(false); const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slot_id: slot.id, ...values }) });
    const data = await response.json(); setPending(false);
    if (!response.ok) { setError(data.error ?? "We could not complete that booking."); return; }
    onBooked(data.confirmation);
  }
  return <form className="booking-form" onSubmit={submit}>
    <label>Full name<input required name="patient_name" minLength={2} placeholder="Ada Lovelace" /></label>
    <label>Email<input required name="patient_email" type="email" placeholder="ada@example.com" /></label>
    <label>Phone<input required name="patient_phone" minLength={6} placeholder="+47 400 00 000" /></label>
    {error && <p className="form-error">{error}</p>}
    <button disabled={pending} type="submit">{pending ? "Booking…" : "Confirm appointment"}</button>
  </form>;
}
