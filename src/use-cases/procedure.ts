
import { createProcedure, deleteProcedure,  getProcedure,  updateProcedure } from "@/data-access/procedure";
import { NewProcedureType, ProcedureType } from "@/db/schema/procedure";
import { ExtendedUser } from "@/types/next-auth";



// create Procedure use case
export const createProcedureUseCase = async ( user: ExtendedUser, procedureData: NewProcedureType) => {
  
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
    return await createProcedure( procedureData)
}


  // delete procedure use case
  export const deleteProcedureUseCase = async (procedureId: string) => {
    return await deleteProcedure(procedureId)
  }

  // update procedure use case
  export const updateProcedureUseCase = async (procedureId: string, procedureData: ProcedureType) => {
    return await updateProcedure(procedureId, procedureData)
  }
  