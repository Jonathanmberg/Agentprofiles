export type Clinic = { id: string; name: string; city: string; address: string; phone: string };
export type Dentist = { id: string; clinic_id: string; name: string };
export type Slot = { id: string; dentist_id: string; start_time: string; end_time: string; is_booked: boolean };
export type Availability = Slot & { dentist: Dentist; clinic: Clinic };
export type AppointmentConfirmation = {
  appointment_id: string;
  slot_id: string;
  patient_name: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  dentist_name: string;
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
