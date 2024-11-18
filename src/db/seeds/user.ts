
import type { DbType } from "@/db";

import users from "@/db/seeds/data/user.json";
import { UserTable } from "@/db/schema";


// write a function that maps over users and inserts them into the database



export default async function seed( db:  DbType) {
 
  await db.insert(UserTable)
  .values(users.map((user) => ({
    name: user.name,
    role: user.role as "patient" | "admin" | "provider",
    emailVerified: new Date(user.emailVerified),
    id: user.id,
    gender: user.gender as "male" | "female",
    date_of_birth: new Date(user.date_of_birth),
    email: user.email,
    image: user.image,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  })))
  .returning();
 
}


