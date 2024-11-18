
import { InvalidDataError } from "@/use-cases/errors";
import AllergyTable,{ insertAllergySchema, NewAllergyType }  from "@/db/schema/allergy";
import db from "@/db";
import { eq } from "drizzle-orm";

export async function createAllergy( allergyData: NewAllergyType) {

       const parsedData = insertAllergySchema.safeParse(allergyData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
          await db.insert(AllergyTable).values(parsedData.data).returning();
      
  }


  // delete allergy
  export const deleteAllergy = async (allergyId: string) => {
    await db.delete(AllergyTable).where(eq(AllergyTable.id, allergyId)).returning();
  }