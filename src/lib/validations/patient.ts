
import { selectPatientSchema } from "@/db/schema/patient";
import * as z from "zod";

export const NewPatientSchema = selectPatientSchema.extend({
  full_name: z.string().min(3).max(32),
    email: z.string().email(),
    gender: z.enum(["male", "female"]),
    date_of_birth: z.string().date(),
    address: z.string(),
}).omit({ id: true, user_id: true, created_at: true, updated_at: true });



  export type NewPatientType = z.infer<typeof NewPatientSchema>;