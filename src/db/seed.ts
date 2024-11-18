import { Table, getTableName, sql } from "drizzle-orm";
import db, { DbType } from '@/db';
import * as schema from "@/db/schema";
import * as seeds from './seeds';



async function resetTable(db: DbType, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`)
  );
}

async function main() {
  console.log('Starting main function');
for (const table of [
      schema.UserTable,
      schema.AddressTable,
      schema.ProviderTable,
      schema.PatientTable,    
      schema.AdminTable,
      schema.AppointmentTable,    
      schema.EncounterTable,     
      schema.MedicationTable,
      schema.VitalSignTable,
      schema.AllergiesTable,
      schema.ProviderPatientTable,      
      schema.InsuranceTable,
      schema.DiagnosisTable,
      schema.LabTable,
      schema.ProcedureTable,
      schema.ImmunizationTable,
     
    ]) {
      console.log(`Resetting table: ${getTableName(table)}`);
            await resetTable(db, table);
    }  
    console.log('Seeding data');
  await seeds.user(db);
  await seeds.address(db);
  await seeds.provider(db);
  await seeds.patient(db);
  await seeds.admin(db);
  await seeds.appointment(db);
  await seeds.encounter(db);
  await seeds.allergy(db);
  await seeds.medication(db);
  await seeds.vitalSign(db);
  await seeds.insurance(db);
  await seeds.diagnosis(db);
  await seeds.lab(db);
  await seeds.procedure(db);
  await seeds.immunization(db);
  
  }

  main().catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Seeding done!");
		process.exit(0);
	});

