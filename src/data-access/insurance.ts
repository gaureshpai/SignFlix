

// create insurance function. insurance is a related table to patient

import db  from "@/db";
import InsuranceTable, { insertInsuranceSchema, InsuranceType, newInsuranceType } from "@/db/schema/insurance";

import { InvalidDataError, NotFoundError } from "@/use-cases/errors";

import { eq } from "drizzle-orm";

export async function CreateInsurance ( insuranceData: newInsuranceType) {
 
   const parsedData = insertInsuranceSchema.safeParse(insuranceData);

   if (!parsedData.success) {

    throw new InvalidDataError();
}

   await db.insert(InsuranceTable).values(parsedData.data  ).returning();

}


// update insurance function
export async function UpdateInsurance (insuranceData: InsuranceType) {

    const parsedData = insertInsuranceSchema.safeParse(insuranceData);

    if (!parsedData.success) {
        // Handle parse failure, possibly throw an error or log it
        throw new Error('Invalid insurance data');
    }

    await db.update(InsuranceTable).set(parsedData.data).where(eq(InsuranceTable.id, insuranceData.id)).returning();
}


// delete insurance function
export async function DeleteInsurance (insuranceId: string) {
    await db.delete(InsuranceTable).where(eq(InsuranceTable.id, insuranceId)).returning();
}   


// get insurance by id
export const getInsuranceById = async (insuranceId: string) => {
    return await db.query.InsuranceTable.findFirst({
        where: eq(InsuranceTable.id, insuranceId)
    })
}