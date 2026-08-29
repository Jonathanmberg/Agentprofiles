export type Clinic = { id: string; name: string; city: string; address: string; phone: string; neighborhood?: string | null; category?: "dental" | "hair"; service_focus?: string[]; service_description?: string | null; pricing_note?: string | null };
export type Dentist = { id: string; clinic_id: string; name: string };
export type Slot = { id: string; dentist_id: string; start_time: string; end_time: string; is_booked: boolean; price_nok?: number };
export type Availability = Slot & { dentist: Dentist; clinic: Clinic };
export type AppointmentConfirmation = {
  appointment_id: string;
  slot_id: string;
  patient_name: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  dentist_name: string;
  provider_name?: string;
  start_time: string;
  end_time: string;
};

export type AgentActivity = {
  id: string;
  kind: "search" | "availability" | "booking";
  title: string;
  detail: string;
  at: string;
};
