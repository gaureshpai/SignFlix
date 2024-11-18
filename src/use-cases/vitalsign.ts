 // create vital sign use case

import { createVitalSign, deleteVitalSign,  updateVitalSign } from "@/data-access/vitalsign";
import { NewVitalSignType, VitalSignsType } from "@/db/schema/vitalsign";
import { ExtendedUser } from "@/types/next-auth";

 export async function createVitalSignUseCase ( user:ExtendedUser, vitalSignData: NewVitalSignType) {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
      
    return await createVitalSign( vitalSignData)
}

// delete vital sign use case
export async function deleteVitalSignUseCase (vitalSignId: string) {
    return await deleteVitalSign(vitalSignId)     
    }


    