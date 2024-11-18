import db from "@/db";
import AppointmentTable, { AppointmentType, BookAppointmentType, selectAppointmentSchema } from "@/db/schema/appointment";
import { InvalidDataError, NotFoundError } from "@/use-cases/errors";
import { getEncountersByAppointmentId } from "./encouter";

import PatientTable from "@/db/schema/patient";
import { getCurrentUser } from "@/lib/session";
import {  searchUser } from "./user";
import { parseISO,  getDay } from 'date-fns';
import { eq, and  } from 'drizzle-orm';

import { ProviderTable, UserTable } from "@/db/schema";


const workingHours = [
  { slot: 0, time: '09:00:00' },
  { slot: 1, time: '10:00:00' },
  { slot: 2, time: '11:00:00' },
  { slot: 3, time: '12:00:00' },
  { slot: 4, time: '13:00:00' },
  { slot: 5, time: '14:00:00' },
  { slot: 6, time: '15:00:00' },
  { slot: 7, time: '16:00:00' },
  { slot: 8, time: '17:00:00' },
];


//create appointment
export const bookAppointment = async (appointmentData: BookAppointmentType) => { 

  const {  provider_id, scheduled_date,  timeSlotIndex, id, patient_id
  } = appointmentData;

 const appointmentId = id;

  const scheduledDateString = scheduled_date.toISOString();
  const parsedDate = parseISO(scheduledDateString);
  const dayOfWeek = getDay(parsedDate);
  const dateObj = new Date(parsedDate);

  // Format the date as YYYY-MM-DD for PostgreSQL compatibility
const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;


  // Check if the appointment falls within the provider's working hours
  if (dayOfWeek < 1 || dayOfWeek > 6) {
    throw new Error('Provider only works Monday to Saturday.');
  }

 // Check if the time slot is already booked
 const existingAppointments = await db.select().from(AppointmentTable).where(
  and(
    eq(AppointmentTable.provider_id, provider_id),
    eq(AppointmentTable.timeSlotIndex, +timeSlotIndex),
    eq(AppointmentTable.scheduled_date, scheduled_date),
  )
);

  if (existingAppointments.length > 0) {
    throw new Error('The selected time slot is already booked.');
  }



if (appointmentId) {
  await db.update(AppointmentTable).set({
    ...appointmentData, 
    patient_id: patient_id,
    scheduled_date: parsedDate,
    timeSlotIndex: +timeSlotIndex,
    
  }).where(eq(AppointmentTable.id, appointmentId)).returning();
}


  const appointment = await db.insert(AppointmentTable).values({
    ...appointmentData, 
    patient_id: patient_id,
    scheduled_date: parsedDate,
    timeSlotIndex: +timeSlotIndex,
    
  }).returning();

  return appointment;

  
}


export async function getAvailableTimeSlots(providerId: string, date: string) {
  const parsedDate = parseISO(date);
  const dayOfWeek = getDay(parsedDate);

  // Check if the appointment falls within the provider's working hours
  if (dayOfWeek < 1 || dayOfWeek > 6) {
    throw new Error('Provider only works Monday to Saturday.');
  }
  const dateObj = new Date(parsedDate);

  // Fetch booked time slots
  const bookedSlots = await db.select().from(AppointmentTable).where(
    and(
      eq(AppointmentTable.provider_id, providerId),      
      eq(AppointmentTable.scheduled_date, dateObj)
    )
);

  // Get available slots
  const bookedSlotIndexes = bookedSlots.map(slot => slot.timeSlotIndex);
  const availableSlots = workingHours.filter(slot => !bookedSlotIndexes.includes(slot.slot));

  return availableSlots;
}



//get all appointments
export const getAllAppointments = async () => {
    return await db.query.AppointmentTable.findMany();
}   

//get appointment by provider
export const getAppointmentByProviderId = async (providerId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.provider_id, providerId),
        orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
      });
}   

//get appointment by client
export const getAppointmentByPatientId = async (PatentId: string) => {
    return await db.query.AppointmentTable.findMany({
        where: eq(AppointmentTable.patient_id, PatentId) ,
        orderBy: (AppointmentTable, { asc }) => [asc(AppointmentTable.scheduled_date)],
      });
}

//get appointment by id
export const getAppointmentById = async (appointmentId: string) => {
    return await db.query.AppointmentTable.findFirst({
        where: eq(AppointmentTable.id, appointmentId)
      });
}


//update appointment
export const updateAppointment = async (appointmentId: string, appointmentData: AppointmentType) => {
    // Parse the input data against the schema  
    const parsedData = selectAppointmentSchema.safeParse(appointmentData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertAppointmentDataType
    await db.update(AppointmentTable).set(parsedData.data).where(eq(AppointmentTable.id, appointmentId)).returning();

}

//delete appointment
export const deleteAppointment = async (appointmentId: string) => {
    await db.delete(AppointmentTable).where(eq(AppointmentTable.id, appointmentId)).returning();
}


// reschedule appointment
export const rescheduleAppointment = async (appointmentId: string, appointmentData: AppointmentType) => {
    // Parse the input data against the schema  
    const parsedData = selectAppointmentSchema.safeParse(appointmentData);

    if (!parsedData.success) {
        throw new InvalidDataError();
    }

    // Now parsedData.data should conform to InsertAppointmentDataType  
    await db.update(AppointmentTable).set(parsedData.data).where(eq(AppointmentTable.id, appointmentId)).returning();

}


// Abstract function to get appointments and encounters for a patient
export async function getAppointmentsAndEncountersByPatientId(patientId: string) {
    // Step 1: Fetch all appointments for the patient
    const appointments = await getAppointmentByPatientId(patientId);
  
    // Initialize an array to hold all appointments and encounters for the patient
    let results = [];
  
    // Step 2: For each appointment, get encounters
    for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      results.push(...encounters);
    }
  
    return results;
  }


  export async function getAppointmentsAndEncountersByProviderId(providerId: string) {
    // Step 1: Fetch all appointments for the patient
    const appointments = await getAppointmentByProviderId(providerId);
  
    // Initialize an array to hold all appointments and encounters for the patient
    let results = [];
  
    // Step 2: For each appointment, get encounters
    for (const appointment of appointments) {
      const encounters = await getEncountersByAppointmentId(appointment.id);
      results.push(...encounters);
    }
  
    return results;
  }


  



export async function getProviderNameByAppointmentId(appointmentId: string) {
  const result = await db.select({
    providerName: UserTable.name,
  })
  .from(AppointmentTable)
  .innerJoin(ProviderTable, eq(AppointmentTable.provider_id, ProviderTable.id))
  .innerJoin(UserTable, eq(ProviderTable.user_id, UserTable.id))
  .where(eq(AppointmentTable.id, appointmentId))
  .execute();

  return result[0]?.providerName;
}


