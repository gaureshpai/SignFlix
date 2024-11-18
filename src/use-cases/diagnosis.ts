
import {deleteDiagnosis,  getDiagnosis, updateDiagnosis, createDiagnosis } from "@/data-access/diagnosis";
import { DiagnosisType, NewDiagnosisType } from "@/db/schema/diagnosis";
import { ExtendedUser } from "@/types/next-auth";



export async function getDiagnosisUseCase() {
    return await getDiagnosis()
}



// create Diagnosis use case
export const createDiagnosisUseCase = async (user: ExtendedUser, diagnosisData: NewDiagnosisType) => {
 
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
    return await createDiagnosis( diagnosisData)
}

  // delete diagnosis use case
  export const deleteDiagnosisUseCase = async (diagnosisId: string) => {
    return await deleteDiagnosis(diagnosisId)
  }

  // update diagnosis use case
  export const updateDiagnosisUseCase = async (diagnosisId: string, diagnosisData: DiagnosisType) => {
    return await updateDiagnosis(diagnosisId, diagnosisData)
  }
  