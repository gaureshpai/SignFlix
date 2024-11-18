import {  DbType } from "@/db";
import { AppointmentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import EncounterTable, { EncounterTypes } from "../schema/encounter";
import encounters from "@/db/seeds/data/encounter.json";

export default async function seed(db: DbType) {
  const encountersWithAppointmentId = await Promise.all(
   
    encounters.map(async (encounter) => {
      const appointmentId = await db.query.AppointmentTable.findFirst({
        where: eq(AppointmentTable.id, encounter.appointment_id),
      });

      if (appointmentId) {
        return { ...encounter, appointment_id: appointmentId.id,
         date: new Date(encounter.date),
         updated_at: new Date(encounter.updated_at),
         encounter_type: encounter.encounter_type as EncounterTypes["encounter_type"],
        };
      } else {
        throw new Error(`Appointment not found for encounter ${encounter.id}`);
      }
    })
  );

  await db.insert(EncounterTable).values(encountersWithAppointmentId);
}