
import { selectImmunizationSchema } from "@/db/schema/immunization";
import {  authenticatedAction } from "@/lib/safe-action";
import { createImmunizationUseCase } from "@/use-cases/immunization";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createImmunizationAction = authenticatedAction
  .createServerAction()
  .input(    
    selectImmunizationSchema   
  )
  .handler(async ({ ctx, input: {  vaccine_name, site, vaccination_date, vaccination_time, vaccinator} }) => {
    const { path } = await useServerPath();
    await createImmunizationUseCase(ctx.user,{
       vaccine_name, site, vaccination_date, vaccination_time, vaccinator
    });
    revalidatePath(`/patient/${path}`);
  });