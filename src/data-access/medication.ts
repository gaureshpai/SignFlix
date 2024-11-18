import db from "@/db";
import { MedicationTable } from "@/db/schema";
import { insertMedicationSchema, NewMedicationType } from "@/db/schema/medication";
import { InvalidDataError } from "@/use-cases/errors";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId } from "./appointment";




export const getMedications = async () => {
    const medications = await db.query.MedicationTable.findMany();
    return medications;
}


  export async function createMedication( medicationData: NewMedicationType) {
   
       const parsedData = insertMedicationSchema.safeParse(medicationData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertMedicationDataType
       await db.insert(MedicationTable).values(parsedData.data).returning();      
  }


// delete medication
export const deleteMedication = async (medicationId: string) => {
    await db.delete(MedicationTable).where(eq(MedicationTable.id, medicationId)).returning();
}

// update medication
export const updateMedication = async (medicationId: string, medicationData: NewMedicationType) => {
  const startDate = new Date(medicationData.start_date);
  const endDate = new Date(medicationData.end_date);
  await db.update(MedicationTable).set({ ...medicationData, start_date: startDate, end_date: endDate }).where(eq(MedicationTable.id, medicationId)).returning();
}