import { DbType } from "@/db";
import { ImmunizationTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import immunizations from "@/db/seeds/data/immunization.json";

export default async function seed(db: DbType) {
 const preparedImmunizations = await Promise.all(
  immunizations.map(async (immunization) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, immunization.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for immunizaton ${immunization.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the diagnosis object with the encounter ID
     const preparedDiagnosis = {
       ...immunization,
       encounter_id: encounterId,
     };

     return preparedDiagnosis;
   })
 );

 const filteredImmunizations = preparedImmunizations
   .filter((immunization) => immunization !== null && immunization !== undefined)
   .map((immunization) => ({
     encounter_id: immunization.encounter_id,
     vaccine_name: immunization.vaccine_name,
     site: immunization.site,
     vaccination_date: new Date(immunization.vaccination_date),
     vaccination_time: immunization.vaccination_time,
     vaccinator: immunization.vaccinator,
   

     
   }));

 await db.insert(ImmunizationTable).values(filteredImmunizations);
}