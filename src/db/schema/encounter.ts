import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AllergiesTable from "./allergy";
import AppointmentTable from "./appointment";
import DiagnosisTable from "./diagnosis";
import ImmunizationTable from "./immunization";
import LabTable from "./labs";
import PatientTable from "./patient";
import ProcedureTable from "./procedure";
import ProviderTable from "./provider";
import VitalSignsTable from "./vitalsign";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import MedicationTable from "./medication";
import InsuranceTable from "./insurance";
import { z } from "zod";


export const Encounter_type = pgEnum('encounter_type', ["inpatient", "outpatient", "emergency"]);

const EncounterTable = pgTable(
 "encounter",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  appointment_id: uuid("appointment_id")
   .notNull()
   .references(() => AppointmentTable.id, { onDelete: "cascade" }),
  date:   timestamp(" date", { mode: "date" })
  .notNull(),
   time:  time('time', { withTimezone: true }).notNull(),
  encounter_type: Encounter_type('encounter_type').notNull().default('outpatient'),
  chief_complaint: varchar("chief_complaint", { length: 2000 }).notNull(),
  assessment_and_plan: text("assessment_and_plan").notNull(),
  notes: varchar("notes", { length: 2000 }).notNull(),
  updated_at: timestamp("updated_at", { mode: "date" })
   .notNull()
   .defaultNow(),
 },
 (encounter) => ({
  encounterIndex: uniqueIndex("encounterIndex").on(encounter.id),
 })
);

export const EncounterRelations = relations(
 EncounterTable,
  ({ one, many }) => ({
    medications: many(MedicationTable),
    vitalSigns: many(VitalSignsTable),
   diagnoses: many(DiagnosisTable),   
  allergies: many(AllergiesTable),
   procedures: many(ProcedureTable),
   insurance: many(InsuranceTable),
  labs: many(LabTable),
  immunizations: many(ImmunizationTable),  
  appointment: one(AppointmentTable, {
   fields: [EncounterTable.appointment_id],
   references: [AppointmentTable.id],
  }),
 })
);




export const insertEncounterSchema = createInsertSchema(EncounterTable, {
  appointment_id: z.string().uuid({
    message: "Invalid UUID format for appointment_id",
  }),
  date: z.string().datetime({
    message: "Invalid date format for date",
  }),
  time: z.string().datetime({
    message: "Invalid time format for time",
  }),
  encounter_type: z.enum(["inpatient", "outpatient", "emergency"]), 
  chief_complaint: z
    .string()
    .min(1, { message: "Chief complaint is required" })
    .max(200, { message: "Chief complaint must be 2000 characters or less" }),
  assessment_and_plan: z
    .string()
    .min(1, { message: "Assessment and plan is required" })
    .max(2000, { message: "Assessment and plan must be 2000 characters or less" }),
  notes: z
    .string()
    .min(1, { message: "Notes are required" })
    .max(2000, { message: "Notes must be 2000 characters or less" }),
}).omit({
  id: true,
  updated_at: true,
});


export const selectEncounterSchema = createSelectSchema(EncounterTable);

export type NewEncounterType = z.infer<typeof insertEncounterSchema>

export type EncounterTypes = InferSelectModel<typeof EncounterTable>


export default EncounterTable;
