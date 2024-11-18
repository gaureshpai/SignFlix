
import {  authenticatedAction } from "@/lib/safe-action";
import { createEncounterUseCase } from "@/use-cases/encounter";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";
import { insertEncounterSchema } from "@/db/schema/encounter";



export const createEncounterAction = authenticatedAction
  .createServerAction()
  .input(    
    insertEncounterSchema   
  )
  .handler(async ({ ctx, input: {  encounter_type, date, time, chief_complaint,appointment_id, assessment_and_plan, notes } }) => {
    const { path } = await useServerPath();
    await createEncounterUseCase(ctx.user, {
        date, time, encounter_type, chief_complaint, assessment_and_plan, notes, appointment_id
    });
    revalidatePath(`/patient/${path}`);
  });
