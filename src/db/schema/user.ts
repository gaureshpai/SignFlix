import { InferSelectModel, relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

import {
  date,
  uuid,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";
import AdminTable from "./admin";
import PatientTable from "./patient";
import ProviderTable from "./provider";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";



export const userRoles = pgEnum('role', ['patient', 'admin', 'provider']);
export const gender_id = pgEnum('gender', ['male', 'female']);

const UserTable = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    role: userRoles("role").notNull().default('admin'),
    gender: gender_id("gender").notNull().default('male'),
    date_of_birth: date("date_of_birth", { mode: "date" }).notNull().default(new Date("1990-01-01")),
    email: varchar("email", { length: 30 }).notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),       
    image: varchar("image", { length: 2048 }).notNull(),
    created_at: timestamp("created_at",  { mode: "date" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (user) => ({
    emailIndex: uniqueIndex("users__email__idx").on(user.email),
  })
);

export const UsersRelations = relations(UserTable, ({ one }) => ({
  patient: one(PatientTable, {
    fields: [UserTable.id],
    references: [PatientTable.id],
  }),
  provider: one(ProviderTable, {
    fields: [UserTable.id],
    references: [ProviderTable.id],
  }),
  admin: one(AdminTable, {
    fields: [UserTable.id],
    references: [AdminTable.id],
  }),
}));


export const AccountsTable = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const SessionsTable = pgTable("session", {
  sessionToken: uuid("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const VerificationTokensTable = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const insertUserSchema = createInsertSchema(UserTable, {
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  
  role: z.enum(['patient', 'admin', 'provider']),
  
  gender: z.enum(['male', 'female']),
  
  date_of_birth: z.coerce.date()
    .min(new Date('1900-01-01'), "Date of birth must be after 1900")
    .max(new Date(), "Date of birth cannot be in the future")
    .default(() => new Date("1990-01-01")),
  
  email: z.string()
    .email("Invalid email format")
    .max(30, "Email must be 30 characters or less"),
  
  emailVerified: z.date()
    .nullable()
    .optional(),
  
  image: z.string()
    .min(1, "Image URL is required")
    .max(2048, "Image URL must be 2048 characters or less")
    .url("Invalid image URL format"),
  
  created_at: z.date()
    .default(() => new Date()),
  
  updated_at: z.date()
    .default(() => new Date()),
}).omit({ id: true, created_at: true, updated_at: true }); 

export const selectUserSchema = createSelectSchema(UserTable);

export type SelectUser = typeof UserTable.$inferSelect;


export type UserTypes = InferSelectModel<typeof UserTable>

export default UserTable;
