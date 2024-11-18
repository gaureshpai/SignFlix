import { DbType } from "@/db";
import { LabTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import labs from "@/db/seeds/data/lab.json";

export default async function seed(db: DbType) {
 const preparedLabs = await Promise.all(
  labs.map(async (lab) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, lab.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for lab ${lab.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the lab object with the encounter ID
     const preparedLab = {
       ...lab,
       encounter_id: encounterId,
     };

     return preparedLab;
   })
 );

 const filteredLabs = preparedLabs
   .filter((lab) => lab !== null && lab !== undefined)
   .map((lab) => ({
     encounter_id: lab.encounter_id,
     test_Name: lab.test_Name,
     test_Code: lab.test_Code,
     status: lab.status as "pending" | "completed" | "cancelled",
     note: lab.note,
     result: lab.result,
     result_Date: new Date(lab.result_Date),
     date_Ordered: new Date(lab.date_Ordered),

     
   }));

 await db.insert(LabTable).values(filteredLabs);
}