
import db from "@/db";
import PatientTable, { insertPatientSchema, PatientTypes } from "@/db/schema/patient";

import { InvalidDataError} from "@/use-cases/errors";
import { PatientId } from "@/use-cases/types";
import { eq } from "drizzle-orm";
import { cache } from "react";

import { UserTable } from "@/db/schema";





export const createPatient = async (data: Partial<Omit<PatientTypes, 'id'>> & { id: string }, trx = db) => {
    // Parse the input data against the schema
    const parsedData = insertPatientSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    const newPatientData: Omit<PatientTypes, 'id'> = {
        ...parsedData.data,
        preferred_language: parsedData.data.preferred_language || "English",
        created_at: new Date(),
updated_at: new Date(),
    };

    await trx.insert(PatientTable).values(newPatientData).returning();
};

export const updatePatient = async (patientId: string, data: PatientTypes) => {
    // Parse the input data against the schema
    const parsedData = insertPatientSchema.safeParse(data);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertPatientDataType
    await db.update(PatientTable).set(parsedData.data).where(eq(PatientTable.id, patientId)).returning();
}

export const deletePatient = async (patientId: string) => {
    await db.delete(PatientTable).where(eq(PatientTable.id, patientId));
}

export const getPatients = async () => {
    const patients = await db.query.PatientTable.findMany();
    return patients;
}

export const getPatientById = async (patientId: PatientId) => {
    const patient = await db.query.PatientTable.findFirst({
        where: eq(PatientTable.id, patientId),
    });

    return patient;
}


export const searchPatient = cache(async (phone_number: string) => {
    const patient = await db.query.PatientTable.findFirst({
        where: eq(PatientTable.phone_number, phone_number),
        orderBy: (PatientTable, { asc }) => [asc(PatientTable.created_at)],  
        with: {
            appointments: {
              orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
            with: {
              encounter: {
              orderBy: (EncounterTable, { asc }) => [asc(EncounterTable.date)],
            }
            },
            },
            },      
    });
if(patient){
    const { appointments, ...rest } = patient;
    const appointmentsWithEncounters = appointments.map(({ encounter, ...rest }) => ({
        ...rest,
        encounter,
    }));
    return { ...rest, appointments: appointmentsWithEncounters };
}
return null;
}  )  






export async function getPatientWithName(patientId: string) {
    return db.select({
      patientId: PatientTable.id,
      name: UserTable.name, 
      date_of_birth: UserTable.date_of_birth       
    })
    .from(PatientTable)
    .innerJoin(UserTable, eq(PatientTable.user_id, UserTable.id))
    .where(eq(PatientTable.id, patientId))
    .execute();
  }


  