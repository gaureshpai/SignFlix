


 
import db from "@/db";
import { ProcedureTable } from "@/db/schema";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { eq } from 'drizzle-orm';
import { insertProcedureSchema, NewProcedureType, ProcedureType } from "@/db/schema/procedure";



export const getProcedure = async () => {
    const diagnosis = await db.query.ProcedureTable.findMany();
    return diagnosis;
}

  export async function createProcedure(procedureData: NewProcedureType) {            
     
       const parsedData = insertProcedureSchema.safeParse(procedureData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
          // Now parsedData.data should conform to InsertProcedureDataType
      await db.insert(ProcedureTable).values(parsedData.data).returning(); 

       
  }
 
  // delete diagnosis
  export const deleteProcedure = async (diagnosisId: string) => {
    await db.delete(ProcedureTable).where(eq(ProcedureTable.id, diagnosisId)).returning();
  }

  // update diagnosis
  export const updateProcedure = async (procedureId: string, procedureData: ProcedureType) => {
    await db.update(ProcedureTable).set(procedureData).where(eq(ProcedureTable.id, procedureId)).returning();
  }