import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  uuid,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const lab_status = pgEnum('lab_status', ["pending", "completed", "cancelled"]);

const LabTable = pgTable(
 "labs",
 {  
  id: uuid("id").primaryKey().defaultRandom(),
    encounter_id: uuid("encounter_id")
    .notNull()
      .references(() => EncounterTable.id, { onDelete: "cascade" }),
   test_Name: varchar("lab_name", { length: 100 }).notNull(),
   test_Code: varchar("testCode", { length: 100 }).notNull(),
   status: lab_status("lab_status").default("pending").notNull(),
   note: varchar("comments", { length: 2000 }).notNull(),
  result: varchar("lab_result", { length: 2000 }).notNull(),   
     result_Date: timestamp("result_Date", { mode: "date" })
     .notNull(),
     date_Ordered: timestamp("date_Ordered", { mode: "date" })
     .notNull()
     .defaultNow(),    
 },
 (labs) => ({
  labsIndex: uniqueIndex("labsIndex").on(labs.id),
 })
);
export const LabRelations = relations(LabTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [LabTable.encounter_id],
  references: [EncounterTable.id],
 }),
 
}));

export const insertLabSchema = createInsertSchema(LabTable, {
  encounter_id: z.string().uuid({
    message: "Invalid UUID format for encounter_id",
  }),
  test_Name: z
    .string()
    .min(1, { message: "Test name is required" })
    .max(100, { message: "Test name must be 100 characters or less" }),
  test_Code: z
    .string()
    .min(1, { message: "Test code is required" })
    .max(100, { message: "Test code must be 100 characters or less" }),
  status: z.enum(["pending", "completed", "cancelled"]), 
  note: z
    .string()
    .min(1, { message: "Note is required" })
    .max(2000, { message: "Note must be 2000 characters or less" }),
  result: z
    .string()
    .min(1, { message: "Result is required" })
    .max(2000, { message: "Result must be 2000 characters or less" }),
  result_Date: z.string().datetime({
    message: "Invalid date format for result_Date",
  }),
  date_Ordered: z.string().datetime({
    message: "Invalid date format for date_Ordered",
  }),
}).omit({
  id: true,
});
export type NewLabType = z.infer<typeof insertLabSchema>
export const selectLabSchema = createSelectSchema(LabTable);

export type LabType = InferSelectModel<typeof LabTable>

export default LabTable;
