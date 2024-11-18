

 
import db from "@/db";
import { LabTable } from "@/db/schema";
import { InvalidDataError,  } from "@/use-cases/errors";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId,  getAppointmentsAndEncountersByProviderId } from "./appointment";
import { insertLabSchema, LabType, NewLabType } from "@/db/schema/labs";





export const getLab = async () => {
    const lab = await db.query.LabTable.findMany();
    return lab;
}


  export async function createLab( labData: NewLabType) {
      
       const parsedData = insertLabSchema.safeParse(labData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       await db.insert(LabTable).values(parsedData.data).returning();

       
  }

  // delete lab
  export const deleteLab = async (labId: string) => {
    await db.delete(LabTable).where(eq(LabTable.id, labId)).returning();
  }


  // update lab
  export const updateLab = async (labId: string, labData: LabType) => {
    await db.update(LabTable).set(labData).where(eq(LabTable.id, labId)).returning();
  }
  