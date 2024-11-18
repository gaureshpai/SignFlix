
import * as z from "zod";


export const selectProcedureSchema = z.object({
    name: z.string(),
    description: z.string(),
    duration: z.string(),
    date: z.string().date(),
    time: z.string().time(),
    status: z.enum(["completed", "incomplete", "cancelled"]),
    note: z.string(),
});

export type NewProcedureType = z.infer<typeof selectProcedureSchema>