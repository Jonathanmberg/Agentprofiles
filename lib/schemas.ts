import { z } from "zod";

export const clinicSearchSchema = z.object({ city: z.string().trim().min(1).max(80) });
export const availabilitySchema = z.object({
  clinic_id: z.string().uuid(),
  date_from: z.string().datetime({ offset: true }),
  date_to: z.string().datetime({ offset: true }),
}).refine(({ date_from, date_to }) => new Date(date_from) <= new Date(date_to), {
  message: "date_to must be after date_from",
  path: ["date_to"],
});
export const bookingSchema = z.object({
  slot_id: z.string().uuid(),
  patient_name: z.string().trim().min(2).max(120),
  patient_email: z.string().trim().email().max(254),
  patient_phone: z.string().trim().min(6).max(40),
});
