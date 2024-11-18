import type { DbType } from "@/db";
import appointments from "@/db/seeds/data/appointment.json";
import { AppointmentTable, PatientTable, ProviderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AppointmentTypes } from "../schema/appointment";

export default async function seed(db: DbType) {

  const appointmentData = appointments.map(async (appointment) => {
    const scheduledDate = new Date(appointment.scheduled_date);
    const patient = await db.query.PatientTable.findFirst({
      where: eq(PatientTable.id, appointment.patient_id),
    });
    const provider = await db.query.ProviderTable.findFirst({
      where: eq(ProviderTable.id, appointment.provider_id),
    });

    if (patient && provider) {
      return {
        ...appointment,
        patient_id: patient.id,
        provider_id: provider.id,
        scheduled_date: scheduledDate,
        id: appointment.id,
        reason: appointment.reason,
        notes: appointment.notes,
        timeSlotIndex: appointment.timeSlotIndex,
        location: appointment.location,
        type: appointment.type as AppointmentTypes["type"],
        status: appointment.status as AppointmentTypes["status"],
      };
    } else {
      throw new Error(`Patient or provider not found for appointment ${appointment.id}`);
    }
  });
  const appointmentsWithIds = await Promise.all(appointmentData);

  await db.insert(AppointmentTable).values(appointmentsWithIds);
}