import { InferSelectModel, relations } from "drizzle-orm";
import {
 
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const Severity = pgEnum('severity', ["mild","moderate", "severe"]);

const AllergiesTable = pgTable(
 "allergy",
 {
  id: uuid("id").primaryKey().defaultRandom(),
   encounter_id: uuid("encounter_id")
   .notNull()
   .references(() => EncounterTable.id, { onDelete: "cascade" }),
  allergen: varchar("allergen", { length: 100 }).notNull(),
  allergy_reaction: varchar("allergy_reaction", { length: 100 }).notNull(),
 severity: Severity("severity").notNull(),
  note: varchar("note", { length: 2000 }).notNull(),
  updated_At: timestamp("updated_at", { mode: "date" })
  .notNull()
  .defaultNow(),
  created_At: timestamp("created_at", { mode: "date" })
  .notNull()
  .defaultNow(),
 },
 (allergies) => ({
  allergiesIndex: uniqueIndex("allergiesIndex").on(allergies.id),
 })
);

export const AllergiesRelations = relations(AllergiesTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [AllergiesTable.encounter_id],
  references: [EncounterTable.id],
 }),
}));

export const insertAllergySchema = createInsertSchema(AllergiesTable, {
  encounter_id: z.string().uuid({
    message: "Invalid UUID format for encounter_id",
  }),
  allergen: z
    .string()
    .min(1, { message: "Allergen is required" })
    .max(100, { message: "Allergen must be 100 characters or less" }),
  allergy_reaction: z
    .string()
    .min(1, { message: "Allergy reaction is required" })
    .max(100, { message: "Allergy reaction must be 100 characters or less" }),
  severity: z.enum(["mild", "moderate", "severe"]), 
  note: z
    .string()
    .min(1, { message: "Note is required" })
    .max(2000, { message: "Note must be 2000 characters or less" }),
}).omit({
  id: true,
  created_At: true,
  updated_At: true,
});

export const selectAllergiesSchema = createSelectSchema(AllergiesTable);


export type NewAllergyType = z.infer<typeof insertAllergySchema>

export type AllergyType = InferSelectModel<typeof AllergiesTable>

export default AllergiesTable;
