import { createPatient, getPatientById, updatePatient } from "@/data-access/patient";
import { createUser, getUserByEmail } from "@/data-access/user";
import { createTransaction } from "@/data-access/utils";
import { PatientId } from "./types";
import { PatientTypes } from "@/db/schema/patient";
import { NewPatientType } from "@/lib/validations/patient";
import { createAddress } from "@/data-access/address";
import db from "@/db";
import { ExtendedUser } from "@/types/next-auth";




export async function createPatientUseCase(
    user: ExtendedUser,  data: Partial<Omit<NewPatientType, 'id'>> & { id?: string },
  trx = db
) {

    if (user && user.role !== "admin") {
        throw new Error("Only providers can create diagnoses");
      }
    const { 
        full_name,
        email,
        gender,
        date_of_birth,
        phone_number,
        address,
        height,
        weight,
        occupation,
        marital_status,
        emergency_contact_name,
        emergency_contact_relationship,
        emergency_contact_number,
        socialHistory,
        past_medical_history,
        family_medical_history,
        blood_type,
        primary_care_physician,
        preferred_language,
        notes } = data;

        

        const userData = {
            full_name: full_name || '',
            email: email || '',
            date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
            gender: gender || ''
        } as {
            full_name: string;
            email: string;
            date_of_birth: Date | null; // Adjusted to allow for null
            gender: string
        }


const patientData = {
    phone_number,
    height,
    weight,
    occupation,
    marital_status,
    emergency_contact_name,
    emergency_contact_relationship,
    emergency_contact_number,
    socialHistory,
    past_medical_history,
    family_medical_history,
    blood_type,
    primary_care_physician,
    preferred_language,
    notes
} as {
    phone_number: string;
    height: string;
    weight: string;
    occupation: string;
    marital_status: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_number: string;
    socialHistory: string;
    past_medical_history: string;
    family_medical_history: string;
    blood_type: string;
    primary_care_physician: string;
    preferred_language: string;
    notes: string;
}

const addressData = {
    address_line_1: address as string,
}

const userEmail = email as string


      // Check if email already exists
      let existingUser = await getUserByEmail(userEmail);

      let user_id: string;
  
      if (existingUser) {
        // If user exists, use the existing user_id
        user_id = existingUser.id;
      } else {        
        await createTransaction(async (trx) => {
            const newUserData =  await createUser({...userData, name: userData.full_name,gender: gender as "male" | "female", date_of_birth: new Date(date_of_birth!)}, trx);
            if (newUserData.length > 0) {
                const newUser_id = newUserData[0].id;
                const addressResult = await createAddress(addressData);
                const addressId = addressResult.id;
                   
               const newPatient = await createPatient({
                   ...patientData, user_id: newUser_id, address: addressId,
                   
               } as any, trx);
                return newPatient;
            } else {
                throw new Error('Failed to create user');
            }
         
                      
        });
    }
 
   
}
    


export async function updatePatientUseCase(

    patientId: PatientId,
    data: PatientTypes,
): Promise<void> {

    await updatePatient(patientId, data);
}

export async function getPatientByIdUseCase(

    patientId: PatientId,

) {

    return await getPatientById(patientId);
}

export async function deletePatientUseCase(

    data: PatientTypes,
): Promise<void> {

    await createPatient(data);
}

