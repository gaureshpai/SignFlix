import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  numeric,
  uuid,
  pgEnum,
  pgTable,
  text,
  time,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const procedure_status = pgEnum('procedure_status', ["completed", "incomplete", "cancelled", ]);

const ProcedureTable = pgTable(
 "procedure",
 {
  id: uuid("id").primaryKey().defaultRandom(), 
  name: varchar("procedure_name").notNull(),
  description: varchar("procedure_description").notNull(),
  duration: time("procedure_duration").notNull(),
  date: date("procedure_date", { mode: "date" }).notNull(),
  time: time("procedure_time").notNull().default("10:00:00"),
  status: procedure_status("procedure_status").default("completed").notNull(),
  note: varchar("procedure_note").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
 },
 (procedures) => ({
  proceduresIndex: uniqueIndex("proceduresIndex").on(procedures.id),
 })
);

export const ProcedureRelations = relations(ProcedureTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [ProcedureTable.encounter_id],
  references: [EncounterTable.id],
 }),
 
}));

export const insertProcedureSchema = createInsertSchema(ProcedureTable, {
  name: z
  .string()
  .min(1, { message: "Procedure name is required" })
  .max(255, { message: "Procedure name must be 255 characters or less" }),
description: z
  .string()
  .min(1, { message: "Procedure description is required" })
  .max(255, { message: "Procedure description must be 255 characters or less" }),
duration: z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  { message: "Invalid time format for duration (expected HH:MM:SS)" }
),
date: z.string().datetime({ message: "Invalid date format for procedure_date" }),
time: z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: "Invalid time format for procedure_time (expected HH:MM:SS)",
  })
  .default("10:00:00"),
status: z.enum(["completed", "incomplete", "cancelled"]),
note: z
  .string()
  .min(1, { message: "Procedure note is required" })
  .max(255, { message: "Procedure note must be 255 characters or less" }),
encounter_id: z.string().uuid({
  message: "Invalid UUID format for encounter_id",
}),
}).omit({
  id: true,
});
export type NewProcedureType = z.infer<typeof insertProcedureSchema>
export const selectProcedureSchema = createSelectSchema(ProcedureTable)

export type ProcedureType = InferSelectModel<typeof ProcedureTable>



export default ProcedureTable;
