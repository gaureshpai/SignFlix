
import { insertAllergySchema } from "@/db/schema/allergy";
import {  authenticatedAction } from "@/lib/safe-action";
import { useServerPath } from "@/lib/utils";

import { createAllergyUseCase } from "@/use-cases/allergy";
import { revalidatePath } from "next/cache";



export const createAllergyAction = authenticatedAction
  .createServerAction()
  .input(    
    insertAllergySchema   
  )
  .handler(async ({ ctx, input: {  allergen , allergy_reaction, severity, note, encounter_id } }) => {
    const { path } = await useServerPath();
    await createAllergyUseCase(ctx.user,{
       allergen, allergy_reaction, severity, note, encounter_id
    });
    revalidatePath(`/patient/${path}`);
  });