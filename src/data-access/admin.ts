// create a provider

import {  updateUserRoleFn } from "./user";
import { AdminTable, PatientTable, UserTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";
import { AdminTypes } from "@/db/schema/admin";
import { NotFoundError } from "@/use-cases/errors";


// create admin
export const createAdmin = async (UserId: string, adminData: AdminTypes )=>{
   
  const updatedUser = await updateUserRoleFn(UserId, "admin");

  const newAdmin = await updateAdmin(updatedUser.id, adminData );
  return  newAdmin;
}



export const updateAdmin = async (adminId: string, adminData: AdminTypes) => {

  const admin = await db.query.AdminTable.findFirst({
      where: eq(AdminTable.id, adminId)
    });

  if (!admin) {
      throw new NotFoundError();
  }   
  return await db.update(AdminTable).set(adminData).where(eq(AdminTable.id, adminId)).returning();
}


// delete admin
export const deleteAdmin = async (adminId: string) => {
  await db.delete(AdminTable).where(eq(AdminTable.id, adminId)).returning();
}

// get admin by id  
export const getAdminById = async (adminId: string) => {
  return await db.query.AdminTable.findFirst({
    where: eq(AdminTable.id, adminId)
  });
}



export async function getAdminWithName(adminId: string) {
  return db.select({
    adminId: AdminTable.id,
    name: UserTable.name, 
    date_of_birth: UserTable.date_of_birth     
  })
  .from(AdminTable)
  .innerJoin(UserTable, eq(AdminTable.user_id, UserTable.id))
  .where(eq(AdminTable.id, adminId))
  .execute();
}