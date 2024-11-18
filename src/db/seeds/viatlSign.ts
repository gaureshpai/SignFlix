import { DbType } from "@/db";
import { VitalSignTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import vitalSigns from "@/db/seeds/data/vitalSign.json";

export default async function seed(db: DbType) {
 const preparedvitalSigns = await Promise.all(
  vitalSigns.map(async (vitalSign) => {
     // Find the corresponding encounter
     const encounter = await db.query.EncounterTable.findFirst({
       where: eq(EncounterTable.id, vitalSign.encounter_id),
     });

     if (!encounter) {
       console.warn(`No encounter found for vitalSign ${vitalSign.id}`);
       return null;
     }

     const encounterId = encounter.id;

     // Prepare the vitalSign object with the encounter ID
     const preparedVitalSign = {
       ...vitalSign,
       encounter_id: encounterId,
     };

     return preparedVitalSign;
   })
 );

 const filteredVitalSigns = preparedvitalSigns
  .filter((vitalSign) => vitalSign !== null && vitalSign !== undefined)
  .map((vitalSign) => ({
    encounter_id: vitalSign.encounter_id,
    height: vitalSign.height,
    weight: vitalSign.weight.toString(), 
    systolic_pressure: vitalSign.systolic_pressure.toString(), 
    diastolic_pressure: vitalSign.diastolic_pressure.toString(),
    heart_rate: vitalSign.heart_rate.toString(), 
    body_temperature: vitalSign.body_temperature,
    respiratory_rate: vitalSign.respiratory_rate.toString(), 
    oxygen_saturation: vitalSign.oxygen_saturation,
    bmi: vitalSign.bmi,
    measured_at: new Date(vitalSign.measured_at),
  }));

await db.insert(VitalSignTable).values(filteredVitalSigns);
}