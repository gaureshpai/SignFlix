import { createMedication,  getMedications,  deleteMedication, updateMedication } from "@/data-access/medication";
import { NewMedicationType } from "@/db/schema/medication";
import { ExtendedUser } from "@/types/next-auth";



export async function getMedicationUseCase() {
    return await getMedications()
}


// create Medication use case
export const createMedicationUseCase = async (user: ExtendedUser, medicationData: NewMedicationType) => {
 
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }

    return await createMedication( medicationData)
}


  // delete medication use case
  export const deleteMedicationUseCase = async (medicationId: string) => {
    return await deleteMedication(medicationId)
  }

  // update medication use case
  export const updateMedicationUseCase = async (medicationId: string, medicationData: NewMedicationType) => {
    return await updateMedication(medicationId, medicationData)   

  }