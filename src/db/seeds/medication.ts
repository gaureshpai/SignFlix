import { DbType } from "@/db";
import { MedicationTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import labs from "@/db/seeds/data/medication.json";

export default async function seed(db: DbType) {
 const preparedMedications = await Promise.all(
  labs.map(async (medication) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, medication.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for medication ${medication.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the medication object with the encounter ID
     const preparedMedication = {
       ...medication,
       encounter_id: encounterId,
     };

     return preparedMedication;
   })
 );

 const filteredMedications = preparedMedications
   .filter((medication) => medication !== null && medication !== undefined)
   .map((medication) => ({
     encounter_id: medication.encounter_id,
     medication_name: medication.medication_name,
     code: medication.code,
     dosage: medication.dosage,
     frequency: medication.frequency,
     route: medication.route as "oral" | "IV",
     status: medication.status as "active" | "Inactive" | "suspended" | "completed",
     note: medication.note,
     start_date: new Date(medication.start_date),
     end_date: new Date(medication.end_date),

     
   }));

 await db.insert(MedicationTable).values(filteredMedications);
}