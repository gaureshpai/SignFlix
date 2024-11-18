import type { DbType } from "@/db";
import admins from "@/db/seeds/data/admin.json";
import {  AdminTable } from "@/db/schema";


export default async function seed(db:  DbType) {
  await Promise.all(
    admins.map(async (admin) => {
      const NewAdmin = {
        ...admin,
        
      };
      await db.insert(AdminTable).values(NewAdmin).returning();
    })
  );
}