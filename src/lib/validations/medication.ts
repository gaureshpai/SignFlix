import { z } from "zod";

export const selectMedicationSchema = z.object({
    medication_name: z.string(),
    code: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    route: z.enum(["oral", "IV",]),
    status: z.enum(["active", "Inactive", "suspended", "completed"]),
    note: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

export type NewMedicationType = z.infer<typeof selectMedicationSchema>