
import {  authenticatedAction } from "@/lib/safe-action";

import { createVitalSignUseCase } from "@/use-cases/vitalsign";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";
import { insertVitalSignSchema } from "@/db/schema/vitalsign";



export const createVitalSignAction = authenticatedAction
  .createServerAction()
  .input(    
    insertVitalSignSchema   
  )
  .handler(async ({ ctx, input: {  height, weight, systolic_pressure, diastolic_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi, encounter_id } }) => {
    const { path } = await useServerPath();
    await createVitalSignUseCase(ctx.user,{
        height, weight, systolic_pressure, diastolic_pressure, heart_rate, body_temperature, respiratory_rate, oxygen_saturation, bmi,encounter_id
        
    });
    revalidatePath(`/patient/${path}`);
  });