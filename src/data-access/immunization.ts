import { InvalidDataError } from "@/use-cases/errors";
import ImmunizationTable, { insertImmunizationSchema, NewImmunizationType } from "@/db/schema/immunization";
import db from "@/db";
import { eq } from "drizzle-orm";



export async function createImmunization( labData: NewImmunizationType) {
     
       const parsedData = insertImmunizationSchema.safeParse(labData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }

       await db.insert(ImmunizationTable).values(parsedData.data).returning();       
  }


  // delete immunization
  export const deleteImmunization = async (immunizationId: string) => {
    await db.delete(ImmunizationTable).where(eq(ImmunizationTable.id, immunizationId)).returning();
  }