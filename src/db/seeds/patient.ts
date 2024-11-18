import type { DbType } from "@/db";
import patients from "@/db/seeds/data/patient.json";
import { PatientTable, AddressTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PatientTypes } from "../schema/patient";



export default async function seed(db: DbType) {
  const NewPatient: PatientTypes[]  = await Promise.all(
    patients.map(async (patient) => {
      const foundAddress = await db.query.AddressTable.findFirst({
        where: eq(AddressTable.id, patient.address!)
      });
      if (!foundAddress) {
        throw new Error("No address found ");
      }
      return {
        ...patient,
        address: foundAddress.id,
        created_at: new Date(), 
        updated_at: new Date(),
        weight: patient.weight.toString(),
        marital_status: patient.marital_status as PatientTypes["marital_status"],
        blood_type: patient.blood_type as PatientTypes["blood_type"],
        preferred_language: patient.preferred_language as PatientTypes["preferred_language"],
      };
    })
  );
  await db.insert(PatientTable).values(NewPatient);
}

