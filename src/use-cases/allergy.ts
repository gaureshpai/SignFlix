import { createAllergy, deleteAllergy } from "@/data-access/allergy"
import { NewAllergyType } from "@/db/schema/allergy";

import { ExtendedUser } from "@/types/next-auth"

export const createAllergyUseCase = async (user: ExtendedUser, allergyData: NewAllergyType) => {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
    return await createAllergy( allergyData)
}

// delete allergy use case
export const deleteAllergyUseCase = async (allergyId: string) => {
    return await deleteAllergy(allergyId)
}