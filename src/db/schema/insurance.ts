import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable,uuid,text, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import PatientTable from "./patient";
import { z } from "zod";

const InsuranceTable = pgTable(
 "insurance",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
   patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
   insurance_provider: varchar("company_name").notNull(),
  policy_number: varchar("policy_number").notNull(),
  group_number: varchar("group_number").notNull(),
 },
 (insurance) => ({
  insuranceIndex: uniqueIndex("insuranceIndex").on(insurance.id),
 })
);

export const InsuranceRelations = relations(InsuranceTable, ({ one }) => ({
 patient: one(PatientTable, {
  fields: [InsuranceTable.encounter_id],
  references: [PatientTable.id],
 }),
 encounter: one(EncounterTable, {
  fields: [InsuranceTable.encounter_id],
  references: [EncounterTable.id],
 }),
}));

export const insertInsuranceSchema = createInsertSchema(InsuranceTable, {
 encounter_id: z.string().uuid({
  message: "Invalid UUID format for encounter_id",
}),
patient_id: z.string().uuid({
  message: "Invalid UUID format for patient_id",
}),
insurance_provider: z
  .string()
  .min(1, { message: "Insurance provider is required" })
  .max(20, { message: "Insurance provider must be 20 characters or less" }),
policy_number: z
  .string()
  .min(1, { message: "Policy number is required" })
  .max(20, { message: "Policy number must be 20 characters or less" }),
group_number: z
  .string()
  .min(1, { message: "Group number is required" })
  .max(20, { message: "Group number must be 20 characters or less" }),
}).omit({
 id: true,
});
export type newInsuranceType = z.infer<typeof insertInsuranceSchema>

export const selectInsuranceSchema = createSelectSchema(InsuranceTable);

export type InsuranceType = InferSelectModel<typeof InsuranceTable>

export default InsuranceTable;
