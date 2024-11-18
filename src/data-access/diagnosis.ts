


 
import db from "@/db";
import { DiagnosisTable } from "@/db/schema";
import { InvalidDataError, } from "@/use-cases/errors";
import { eq } from 'drizzle-orm';
import { getAppointmentsAndEncountersByPatientId,  getAppointmentsAndEncountersByProviderId } from "./appointment";
import { DiagnosisType, insertDiagnosisSchema, NewDiagnosisType } from "@/db/schema/diagnosis";



export const getDiagnosis = async () => {
    const diagnosis = await db.query.DiagnosisTable.findMany();
    return diagnosis;
}

/* 
  export async function createDiagnosis(EncounterId:string, diagnosisData: DiagnosisTypes) {
    // Step 1: Fetch the encounter
    const encounter = await getEncounterById(EncounterId);
  
    if (!encounter) {
      throw new NotFoundError();
    }          
       // Now parsedData.data should conform to InsertDiagnosisDataType
       // Step 3: Create the diagnosis with the (existing or new) encounterId
       const parsedData = insertDiagnosisSchema.safeParse({...diagnosisData, encounter_id: encounter.id});

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       // Now parsedData.data should conform to InsertDiagnosisDataType
       await db.insert(DiagnosisTable).values(parsedData.data).returning();

       
  } */


  export async function createDiagnosis( diagnosisData: NewDiagnosisType) {
 
       const parsedData = insertDiagnosisSchema.safeParse(diagnosisData);

       if (!parsedData.success) {
           throw new InvalidDataError();
       }
   
       await db.insert(DiagnosisTable).values(parsedData.data).returning();
       
  }
  // get diagnosis for an encounter

  export async function getDiagnosisByEncounterId(encounterId: string) {
    const diagnosis = await db.query.DiagnosisTable.findMany({
      where: eq(DiagnosisTable.encounter_id, encounterId), 
    });
    return diagnosis;
  }




  // get diagnosis for a patient
  // New function to get diagnoses by patient ID, reusing the abstraction
export async function getDiagnosesByPatientId(patientId: string) {
    const Encounters = await getAppointmentsAndEncountersByPatientId(patientId);
  
    // Initialize an array to hold all diagnoses for the patient
    let diagnoses = [];
  
    // Step 3: For each encounter, get diagnoses
      for (const encounter of Encounters) {
        const allDiagnoses = await getDiagnosisByEncounterId(encounter.id);
        diagnoses.push(...allDiagnoses);
      }
    
  
    return diagnoses;
  }


  
  export async function getDiagnosesByProviderId(providerId: string) {
    const Encounters = await getAppointmentsAndEncountersByProviderId(providerId);
  
    // Initialize an array to hold all labs for the patient
    let diagnoses = [];
  
    // Step 3: For each encounter, get labs
      for (const encounter of Encounters) {
        const allDiagnoses = await getDiagnosisByEncounterId(encounter.id);
        diagnoses.push(...allDiagnoses);
      }
    
  
    return diagnoses;
  }


  // delete diagnosis
  export const deleteDiagnosis = async (diagnosisId: string) => {
    await db.delete(DiagnosisTable).where(eq(DiagnosisTable.id, diagnosisId)).returning();
  }

  // update diagnosis
  export const updateDiagnosis = async (diagnosisId: string, diagnosisData: DiagnosisType) => {
    await db.update(DiagnosisTable).set(diagnosisData).where(eq(DiagnosisTable.id, diagnosisId)).returning();
  }