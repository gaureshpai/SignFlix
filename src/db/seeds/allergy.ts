import {  DbType } from "@/db";
import { AllergiesTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import allergies from "@/db/seeds/data/allergy.json";




export default async function seed( db: DbType) {
 const preparedAllergies = await Promise.all(
   allergies.map(async (allergy) => {
     // Find the corresponding encounter
     const encounter  = await db.query.AllergiesTable.findFirst({
      where: eq(EncounterTable.id, AllergiesTable.encounter_id!)
     })

     if (!encounter) {
       console.warn(`No encounter found for allergy ${allergy.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the allergy object with the encounter ID
     const preparedAllergy = {
       ...allergy,
       encounter_id: encounterId,
     };

     return preparedAllergy;
   })
 );
 const filteredAllergies = preparedAllergies
  .filter((allergy) => allergy !== null && allergy !== undefined)
  .map((allergy) => ({
    encounter_id: allergy.encounter_id,
    allergen: allergy.allergen,
    allergy_reaction: allergy.allergy_reaction,
    severity: allergy.severity as "mild" | "moderate" | "severe",
    note: allergy.note,
    created_At: new Date(allergy.created_At),
  }));

if (filteredAllergies.length > 0) {
  await db.insert(AllergiesTable).values(filteredAllergies);
} else {
  console.log('No allergies to insert');
}
}
