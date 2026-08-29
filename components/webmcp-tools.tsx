"use client";

import { useEffect, useState } from "react";
import { emitAgentActivity } from "@/components/activity-provider";

type Tool = { name: string; description: string; inputSchema: Record<string, unknown>; annotations?: Record<string, unknown>; execute: (args: any) => Promise<{ content: { type: "text"; text: string }[] }> };
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<void>; unregisterTool?: (tool: Tool | string) => void | Promise<void> };

const schemas = {
  find: { type: "object", additionalProperties: false, properties: { city: { type: "string", description: "Norwegian city to search, such as Oslo or Bergen." } }, required: ["city"] },
  availability: { type: "object", additionalProperties: false, properties: { clinic_id: { type: "string", description: "UUID of the clinic returned by find_clinics." }, date_from: { type: "string", format: "date-time", description: "Inclusive ISO 8601 start time." }, date_to: { type: "string", format: "date-time", description: "Inclusive ISO 8601 end time." } }, required: ["clinic_id", "date_from", "date_to"] },
  book: { type: "object", additionalProperties: false, properties: { slot_id: { type: "string", description: "UUID of the open slot to reserve." }, patient_name: { type: "string", description: "Patient's full name." }, patient_email: { type: "string", format: "email", description: "Email address for appointment confirmation." }, patient_phone: { type: "string", description: "Phone number including country code when available." } }, required: ["slot_id", "patient_name", "patient_email", "patient_phone"] },
};

async function request(path: string, options?: RequestInit) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Request failed.");
  return payload;
}
const text = (payload: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }] });

export function WebMCPTools() {
  const [status, setStatus] = useState<"checking" | "active" | "fallback" | "unavailable">("checking");
  useEffect(() => {
    let context: ModelContext | undefined;
    const controller = new AbortController();
    const tools: Tool[] = [
      { name: "find_clinics", description: "Search trusted DentalBookings clinics by Norwegian city and return clinic contact details so the patient or their agent can choose where to receive care.", inputSchema: schemas.find, annotations: { readOnlyHint: true }, execute: async ({ city }) => { const data = await request(`/api/clinics?city=${encodeURIComponent(city)}`); emitAgentActivity({ kind: "search", title: `Searched clinics in ${city}`, detail: `${data.clinics.length} trusted clinic${data.clinics.length === 1 ? "" : "s"} found.` }); return text(data); } },
      { name: "check_availability", description: "Find open dental appointment slots for every dentist at one DentalBookings clinic within an ISO date range, including local time and dentist details for comparing options.", inputSchema: schemas.availability, annotations: { readOnlyHint: true }, execute: async (input) => { const query = new URLSearchParams(input); const data = await request(`/api/availability?${query}`); emitAgentActivity({ kind: "availability", title: "Compared appointment availability", detail: `${data.slots.length} open slot${data.slots.length === 1 ? "" : "s"} returned for the requested dates.` }); return text(data); } },
      { name: "book_appointment", description: "Reserve one currently open dental appointment slot and create a patient appointment. Use only after the patient has confirmed the exact slot and provided their contact details.", inputSchema: schemas.book, annotations: { readOnlyHint: false, destructiveHint: false }, execute: async (input) => { const data = await request("/api/appointments", { method: "POST", body: JSON.stringify(input) }); emitAgentActivity({ kind: "booking", title: "Appointment booked", detail: `${data.confirmation.clinic_name} with ${data.confirmation.dentist_name} is confirmed.` }); window.dispatchEvent(new CustomEvent("dentalbookings:confirmation", { detail: data.confirmation })); return text(data); } },
    ];
    async function register() {
      if (!window.isSecureContext) { setStatus("unavailable"); return; }
      if ("modelContext" in navigator) {
        context = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
        setStatus("active");
      } else {
        await import("@mcp-b/global");
        context = ((navigator as Navigator & { modelContext?: ModelContext }).modelContext ?? (document as Document & { modelContext?: ModelContext }).modelContext);
        setStatus(context ? "fallback" : "unavailable");
      }
      if (!context) return;
      await Promise.all(tools.map((tool) => context!.registerTool(tool, { signal: controller.signal })));
    }
    register().catch(() => setStatus("unavailable"));
    return () => {
      controller.abort();
      if (context?.unregisterTool) tools.forEach((tool) => void context!.unregisterTool!(tool));
    };
  }, []);
  return <div className={`webmcp-status ${status}`} title={status === "active" ? "Native WebMCP tools active" : status === "fallback" ? "WebMCP fallback active" : "WebMCP is not available in this browser"}><span /> {status === "checking" ? "Checking WebMCP" : status === "active" ? "WebMCP active" : status === "fallback" ? "WebMCP fallback active" : "WebMCP unavailable"}</div>;
}
