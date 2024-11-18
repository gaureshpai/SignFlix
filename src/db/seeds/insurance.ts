import { DbType } from "@/db";
import { InsuranceTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Insurances from "@/db/seeds/data/insurance.json";

export default async function seed(db: DbType) {
 const preparedImmunizations = await Promise.all(
  Insurances.map(async (insurance) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, insurance.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for insurance ${insurance.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the diagnosis object with the encounter ID
     const preparedImmunization = {
       ...insurance,
       encounter_id: encounterId,
     };

     return preparedImmunization;
   })
 );

 const filteredInsurances = preparedImmunizations
   .filter((insurance) => insurance !== null && insurance !== undefined)
   .map((insurance) => ({
     encounter_id: insurance.encounter_id,
     insurance_provider: insurance.insurance_provider,
     policy_number: insurance.policy_number,
     group_number: insurance.group_number,
     patient_id: insurance.patient_id,
   

     
   }));

 await db.insert(InsuranceTable).values(filteredInsurances);
}