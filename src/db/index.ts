

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

 const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema, logger: true });

export type DbType  = typeof db;

export default db;


