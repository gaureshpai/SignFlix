// create vital sign function

import VitalSignsTable, { insertVitalSignSchema, NewVitalSignType, VitalSignsType } from "@/db/schema/vitalsign";
import { InvalidDataError} from "@/use-cases/errors";
import db from "@/db";
import { eq } from "drizzle-orm";


export async function createVitalSign( vitalsignnData: NewVitalSignType) {
   
  
       const parsedData = insertVitalSignSchema.safeParse(vitalsignnData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertVitalSignDataType
       await db.insert(VitalSignsTable).values(parsedData.data).returning();

       
  }


  // update vital sign function
  export const updateVitalSign = async (vitalSignData: VitalSignsType) => {

    const parsedData = insertVitalSignSchema.safeParse(vitalSignData);

    if (!parsedData.success) {
      throw new InvalidDataError();
    }   
    await db.update(VitalSignsTable).set(parsedData.data).where(eq(VitalSignsTable.id, vitalSignData.id)).returning();
  } 

  // delete vital sign function
  export const deleteVitalSign = async (vitalSignId: string) => {
    await db.delete(VitalSignsTable).where(eq(VitalSignsTable.id, vitalSignId)).returning();
  }
