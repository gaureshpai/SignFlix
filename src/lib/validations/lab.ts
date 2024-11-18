
// create a zod schema for lab from the lab table

import { selectLabSchema } from "@/db/schema/labs";
import * as z from "zod";

export const NewLabSchema = selectLabSchema.omit({
  id: true,
  encounter_id: true
})

export type NewLabType = z.infer<typeof NewLabSchema>