import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";


const ImmunizationTable = pgTable(
 "immunization",
 {
  id: uuid("id").primaryKey().defaultRandom(), 
  vaccine_name: varchar("vaccine_name", { length: 100 }).notNull(),
  site: text("site").notNull(),
  vaccination_date: timestamp("vaccination_date", { mode: "date" })
  .notNull(),
  vaccination_time: time("time_administered").notNull(),
  encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
   vaccinator: varchar("administrator", { length: 100 }).notNull(),
 },
 (immunization) => ({
  immunizationIndex: uniqueIndex("immunizationIndex").on(immunization.id),
 })
);

export const ImmunizationRelations = relations(
 ImmunizationTable,
 ({ one }) => ({
  encounter: one(EncounterTable, {
   fields: [ImmunizationTable.encounter_id],
   references: [EncounterTable.id],
  }),

 })
);

export const insertImmunizationSchema = createInsertSchema(ImmunizationTable, {
  vaccine_name: z
    .string()
    .min(1, { message: "Vaccine name is required" })
    .max(100, { message: "Vaccine name must be 100 characters or less" }),
  site: z.string().min(1, { message: "Site is required" }),
  vaccination_date: z.string().datetime({
    message: "Invalid date format for vaccination_date",
  }),
  vaccination_time: z.string().datetime({
    message: "Invalid time format for time_administered",
  }),
  encounter_id: z.string().uuid({
    message: "Invalid UUID format for encounter_id",
  }),
  vaccinator: z
    .string()
    .min(1, { message: "Vaccinator name is required" })
    .max(100, { message: "Vaccinator name must be 100 characters or less" }),
}).omit({
  id: true,
});

export const selectImmunizationSchema = createSelectSchema(ImmunizationTable);
export type NewImmunizationType = z.infer<typeof insertImmunizationSchema>
export type ImmunizationType = InferSelectModel<typeof ImmunizationTable>

export default ImmunizationTable;
