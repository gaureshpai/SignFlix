import { createEncounter,  updateEncounter,  } from "@/data-access/encouter";
import { EncounterId,  } from "./types";
import { EncounterTypes, NewEncounterType } from "@/db/schema/encounter";
import { ExtendedUser } from "@/types/next-auth";



export async function createEncounterUseCase(
user: ExtendedUser, encounterData: NewEncounterType,
    
) {
    if (user && user.role !== "provider") {
        throw new Error("Only providers can create diagnoses");
      }
      
    await createEncounter(encounterData)         
}

export async function updateEcnounterUseCase(
   
    encounterId: EncounterId, data: EncounterTypes
) {
    await updateEncounter( encounterId, data)     
}




