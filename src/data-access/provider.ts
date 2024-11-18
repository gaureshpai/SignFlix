
import db from "@/db";
import ProviderTable, { ProviderTypes } from "@/db/schema/provider";
import {  NotFoundError } from "@/use-cases/errors";
import { ProviderId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import {  SingleProvider, updateUserRoleFn } from "./user";
import UserTable from "@/db/schema/user";
import { cache } from "react";
import { SelectAppointment, SelectEncounter, SelectProvider, SelectUser} from "@/types";




export const createProvider = async (UserId: string, providerData: ProviderTypes )=>{
  
  const updatedUser = await updateUserRoleFn(UserId, "provider");

 const newProvider = await updateProvider(updatedUser.id, providerData );
  return { newProvider}
}




export const updateProvider = async (providerId: ProviderId, providerData: ProviderTypes) => {

    const provider = await db.query.ProviderTable.findFirst({
        where: eq(ProviderTable.id, providerId)
      });

    if (!provider) {
        throw new NotFoundError();
    }   
    return await db.update(ProviderTable).set(providerData).where(eq(ProviderTable.id, providerId)).returning();
}

// delete provider
export const deleteProvider = async (providerId: string) => {
    await db.delete(ProviderTable).where(eq(ProviderTable.id, providerId)).returning();
}



export const getProviderData = cache(async (query: string): Promise<SingleProvider> => { 
  try {
    const user = await db.query.UserTable.findFirst({
      where: 
        eq(UserTable.id, query),
      
      
      orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
      with: {
        provider: {
          with: {
            appointments: {
              orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
              with: {
                encounter: {
                  orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
                  with: {
                    medications: true,
                    vitalSigns: true,
                    diagnoses: true,
                    allergies: true,
                    procedures: true,
                    labs: true,
                    immunizations: true,
                    insurance: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user ) {
      throw new Error("User not found");
    }


    /* const encounters = user.provider?.appointments.flatMap(appointment =>
      appointment.encounter.map(encounter => ({
        ...encounter,
        medications: encounter.medications,
        vitalSigns: encounter.vitalSigns,
        diagnoses: encounter.diagnoses,
        allergies: encounter.allergies,
        procedures: encounter.procedures,
        labs: encounter.labs,
        immunizations: encounter.immunizations,
        insurance: encounter.insurance,
      }))
    ); */

   
    return user
      
  } catch (error) {
    console.error("Error searching user:", error);
    throw error;
  }
}); 

// get all providers
export const getProviders = cache(async () => {
  try {
    const providers = await db.query.UserTable.findMany({
      where: 
        eq(UserTable.role, "provider"),
      orderBy: (UserTable, { asc }) => [asc(UserTable.created_at)],
    });
    return providers;
  } catch (error) {
    console.error("Error searching providers:", error);
    throw error;
  }
});