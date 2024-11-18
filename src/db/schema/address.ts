import { numeric,uuid, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { InferSelectModel } from "drizzle-orm";

import { relations } from "drizzle-orm/relations";      
import PatientTable from "./patient";


const AddressTable = pgTable("address", {
 id: uuid("id").primaryKey().defaultRandom(),
 address_line_1: varchar("address_line_1", { length: 100 }),
 address_line_2: varchar("address_line_2", { length: 100 }),
    city: varchar("city", { length: 20 }),
    state: varchar("state", { length: 20 }),
    zip_code: numeric("zip_code", { precision: 5, scale: 0 }),
 country: text("country")
});

export type AddressTypes = InferSelectModel<typeof AddressTable>;

export const insertAddressSchema = createInsertSchema(AddressTable);

export const selectAddressSchema = createSelectSchema(AddressTable);


export default AddressTable



export const AddressRelations = relations(AddressTable, ({ one }) => ({
    patient: one(PatientTable, {
      fields: [AddressTable.id],
      references: [PatientTable.address],
    }),
   
  }));