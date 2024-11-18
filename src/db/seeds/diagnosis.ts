import { DbType } from "@/db";
import { DiagnosisTable, EncounterTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import diagnoses from "@/db/seeds/data/diagnosis.json";

export default async function seed(db: DbType) {
  const preparedDiagnoses = await Promise.all(
    diagnoses.map(async (diagnosis) => {
      // Find the corresponding encounter
      const encounter = await db.query.EncounterTable.findFirst({
        where: eq(EncounterTable.id, diagnosis.encounter_id),
      });

      if (!encounter) {
        console.warn(`No encounter found for diagnosis ${diagnosis.id}`);
        return null;
      }

      const encounterId = encounter.id;

      // Prepare the diagnosis object with the encounter ID
      const preparedDiagnosis = {
        ...diagnosis,
        encounter_id: encounterId,
      };

      return preparedDiagnosis;
    })
  );

  const filteredDiagnoses = preparedDiagnoses
    .filter((diagnosis) => diagnosis !== null && diagnosis !== undefined)
    .map((diagnosis) => ({
      encounter_id: diagnosis.encounter_id,
      severity: diagnosis.severity as "mild" | "moderate" | "severe",
      note: diagnosis.note,
      diagnosis_name: diagnosis.diagnosis_name,
      diagnosis_code: diagnosis.diagnosis_code,
      created_At: new Date(diagnosis.created_At),
      updated_At: new Date(diagnosis.updated_At),
    

      
    }));

  await db.insert(DiagnosisTable).values(filteredDiagnoses);
}