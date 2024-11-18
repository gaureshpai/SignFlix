import { createImmunization } from "@/data-access/immunization"
import { NewImmunizationType } from "@/db/schema/immunization";
import { ExtendedUser } from "@/types/next-auth";

// create Immunization use case
export const createImmunizationUseCase = async (user: ExtendedUser, immunizationData: NewImmunizationType) => {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
    return await createImmunization(immunizationData)   
}
