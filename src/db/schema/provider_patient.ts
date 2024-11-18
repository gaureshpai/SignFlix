import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import PatientTable from "./patient";
import ProviderTable from "./provider";

const ProviderPatientTable = pgTable(
 "provider_patient",
 {
  patient_id: uuid("patient_id")
   .notNull()
   .references(() => PatientTable.id, { onDelete: "cascade" }),
  provider_id: uuid("provider_id")
   .notNull()
   .references(() => ProviderTable.id, { onDelete: "cascade" }),
 },
 (t) => ({
  pk: primaryKey({ columns: [t.patient_id, t.provider_id] }),
 })
);

export const ProviderPatientRelations = relations(
 ProviderPatientTable,
 ({ one }) => ({
  patients: one(PatientTable, {
   fields: [ProviderPatientTable.patient_id],
   references: [PatientTable.id],
  }),

  providers: one(ProviderTable, {
   fields: [ProviderPatientTable.provider_id],
   references: [ProviderTable.id],
  }),
 })
);

export default ProviderPatientTable;
