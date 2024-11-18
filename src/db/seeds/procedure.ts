import { DbType } from "@/db";
import { ProcedureTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import labs from "@/db/seeds/data/procedure.json";

export default async function seed(db: DbType) {
 const preparedProcedures = await Promise.all(
  labs.map(async (procedure) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, procedure.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for procedure ${procedure.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the procedure object with the encounter ID
     const preparedProcedure = {
       ...procedure,
       encounter_id: encounterId,
     };

     return preparedProcedure;
   })
 );

 const filteredProcedures = preparedProcedures
   .filter((procedure) => procedure !== null && procedure !== undefined)
   .map((procedure) => ({
     encounter_id: procedure.encounter_id, 
     name: procedure.name,
     description: procedure.description,
     duration: procedure.duration,
     date: procedure.date,
     status: procedure.status as "cancelled"| "incomplete"| "completed",
     note: procedure.note,
    

     
   }));

 await db.insert(ProcedureTable).values(filteredProcedures);
}