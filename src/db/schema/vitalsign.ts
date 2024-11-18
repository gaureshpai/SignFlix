import { InferSelectModel, relations } from "drizzle-orm";
import {
  integer,
    numeric,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid
} from "drizzle-orm/pg-core";
import EncounterTable from "./encounter";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";


const VitalSignsTable = pgTable(
  "vital_signs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    
    encounter_id: uuid("encounter_id")
      .notNull()
      .references(() => EncounterTable.id, { onDelete: "cascade" }),

      height: numeric("height", { precision: 4, scale: 2 }).notNull(),
      weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
    
    systolic_pressure: integer("systolic_pressure").notNull(),
    diastolic_pressure: integer("diastolic_pressure").notNull(),
    
    heart_rate: integer("heart_rate").notNull(),
    
    body_temperature: numeric("body_temperature", { precision: 4, scale: 1 }).notNull(),
    
    respiratory_rate: integer("respiratory_rate").notNull(),
    
    oxygen_saturation: numeric("oxygen_saturation", { precision: 5, scale: 2 }).notNull(),
    
    bmi: numeric("bmi", { precision: 4, scale: 1 }).notNull(),    
    
  },
  (vitalSigns) => ({
    encounterIndex: uniqueIndex("encounter__id__idx").on(vitalSigns.encounter_id),
  })
);


export const VitalSignRelations = relations(VitalSignsTable, ({ one }) => ({
 encounter: one(EncounterTable, {
  fields: [VitalSignsTable.encounter_id],
  references: [EncounterTable.id],
 }),

 
}));


export const insertVitalSignSchema = createInsertSchema(VitalSignsTable, {
  encounter_id: z.string().uuid({
    message: "Invalid UUID format for encounter_id"
  }),
    height: z.number()
    .min(0, "Height must be positive")
    .max(99.99, "Height exceeds maximum value")
    .multipleOf(0.01, "Height must have at most 2 decimal places"),
  
  weight: z.number()
    .min(0, "Weight must be positive")
    .max(999.99, "Weight exceeds maximum value")
    .multipleOf(0.01, "Weight must have at most 2 decimal places"),
  
  systolic_pressure: z.number()
    .int("Systolic pressure must be an integer")
    .min(60, "Systolic pressure too low")
    .max(250, "Systolic pressure too high"),
  
  diastolic_pressure: z.number()
    .int("Diastolic pressure must be an integer")
    .min(40, "Diastolic pressure too low")
    .max(150, "Diastolic pressure too high"),
  
  heart_rate: z.number()
    .int("Heart rate must be an integer")
    .min(30, "Heart rate too low")
    .max(250, "Heart rate too high"),
  
  body_temperature: z.number()
    .min(95.0, "Body temperature too low")
    .max(108.0, "Body temperature too high")
    .multipleOf(0.1, "Body temperature must have at most 1 decimal place"),
  
  respiratory_rate: z.number()
    .int("Respiratory rate must be an integer")
    .min(8, "Respiratory rate too low")
    .max(60, "Respiratory rate too high"),
  
  oxygen_saturation: z.number()
    .min(0, "Oxygen saturation must be positive")
    .max(100.00, "Oxygen saturation cannot exceed 100%")
    .multipleOf(0.01, "Oxygen saturation must have at most 2 decimal places"),
  
  bmi: z.number()
    .min(10.0, "BMI too low")
    .max(100.0, "BMI too high")
    .multipleOf(0.1, "BMI must have at most 1 decimal place"),
  }).omit({
  id: true,
});

export type NewVitalSignType = z.infer<typeof insertVitalSignSchema>

export const selectVitalSignSchema = createSelectSchema(VitalSignsTable) 


export type VitalSignsType = InferSelectModel<typeof VitalSignsTable>
 
export default VitalSignsTable;