import { InferSelectModel, relations } from "drizzle-orm";
import { date, uuid, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";



export const Med_Route = pgEnum('med_route', ["oral", "IV"]);


export const Med_Status = pgEnum('med_status', ["active", "Inactive", "suspended", "completed"]);


const MedicationTable = pgTable(
 "medication",
 {
  id: uuid("id").primaryKey().defaultRandom(),
    encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  medication_name: varchar("medication_name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  route: Med_Route("med_route").notNull(),  
  status: Med_Status("med_status").notNull(),
  note: varchar("note", { length: 100 }).notNull(),
  start_date: timestamp("start_date", { mode: "date" })
  .notNull(),
  end_date: timestamp("end_date", { mode: "date" })
  .notNull(),
 },
 (medications) => ({
  medicationsIndex: uniqueIndex("medicationsIndex").on(medications.id),
 })
);

export const MedicationRelations = relations(
 MedicationTable,
 ({  one }) => ({
  encounter: one(EncounterTable, {
  fields: [MedicationTable.encounter_id],
  references: [EncounterTable.id],
 })
}));




export const insertMedicationSchema = createInsertSchema(MedicationTable, {
  encounter_id: z.string().uuid({
    message: "Invalid UUID format for encounter_id",
  }),
  medication_name: z
    .string()
    .min(1, { message: "Medication name is required" })
    .max(100, { message: "Medication name must be 100 characters or less" }),
  code: z
    .string()
    .min(1, { message: "Code is required" })
    .max(50, { message: "Code must be 50 characters or less" }),
  dosage: z
    .string()
    .min(1, { message: "Dosage is required" })
    .max(100, { message: "Dosage must be 100 characters or less" }),
  frequency: z
    .string()
    .min(1, { message: "Frequency is required" })
    .max(100, { message: "Frequency must be 100 characters or less" }),
  route: z.enum(["oral", "IV"]),
  status: z.enum(["active", "Inactive", "suspended", "completed"]),
  note: z
    .string()
    .min(1, { message: "Note is required" })
    .max(100, { message: "Note must be 100 characters or less" }),
  start_date: z.string().datetime({
    message: "Invalid date format for start_date",
  }),
  end_date: z.string().datetime({
    message: "Invalid date format for end_date",
  }),
}).omit({
  id: true,
});
export type NewMedicationType = z.infer<typeof insertMedicationSchema>
export const selectMedicationSchema = createSelectSchema(MedicationTable)

export type MedicationType = InferSelectModel<typeof MedicationTable>



export default MedicationTable;
