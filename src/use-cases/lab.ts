
import { createLab,  deleteLab, updateLab } from "@/data-access/lab"
import { LabType, NewLabType } from "@/db/schema/labs"
import { ExtendedUser } from "@/types/next-auth"


// create Lab use case
export const createLabUseCase = async (user: ExtendedUser, labData: NewLabType) => {
 
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
    return await createLab( labData)
}


// delete lab use case
  export const deleteLabUseCase = async (labId: string) => {
    return await deleteLab(labId)
  }


  // update lab use case
  export const updateLabUseCase = async (labId: string, labData: LabType) => {
    return await updateLab(labId, labData)
  }