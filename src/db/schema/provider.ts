import { InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable,  uuid, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import AppointmentTable from "./appointment";
import ProviderPatientTable from "./provider_patient";
import UserTable from "./user";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const provider_type = pgEnum('provider_type', ["MD",
    "NP"]);

const ProviderTable = pgTable(
 "provider",
 {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
   .notNull()
   .references(() => UserTable.id, { onDelete: "cascade" }),
  specialty: varchar("specialty", { length: 2000 }).notNull().default("Primary Care Physician"),
   license_number: varchar("license_number", { length: 10 }).notNull().default("LIC100000123"),
  provider_qualification: provider_type("provider_type").default("MD").notNull(),
 },
 (provider) => ({
  providerIndex: uniqueIndex("providerIndex").on(provider.id),
 })
);

export const providerRelations = relations(ProviderTable, ({ one, many }) => ({
 appointments: many(AppointmentTable),
 providers_patients: many(ProviderPatientTable),
 user: one(UserTable, {
  fields: [ProviderTable.user_id],
  references: [UserTable.id],
 }),
}));



export const insertProviderSchema = createInsertSchema(ProviderTable, {
  user_id: z.string().uuid({
    message: "Invalid UUID format for user_id",
  }),
  
  specialty: z.string()
    .min(1, "Specialty is required")
    .max(2000, "Specialty must be 2000 characters or less")
    .default("Primary Care Physician"),
  
  license_number: z.string()
    .min(1, "License number is required")
    .max(10, "License number must be 10 characters or less")
    .default("LIC100000123"),
  
    provider_qualification: z.enum(["MD", "NP"]),
}).omit({
    id: true,
  });
export const selectProviderSchema = createSelectSchema(ProviderTable);

export type ProviderTypes = InferSelectModel<typeof ProviderTable>

export default ProviderTable;
