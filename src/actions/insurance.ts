
import {  authenticatedAction } from "@/lib/safe-action";
import { NewInsuranceSchema } from "@/lib/validations/insurance";
import { CreateInsuranceUseCase } from "@/use-cases/insurance";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createInsuranceAction = authenticatedAction
  .createServerAction()
  .input(    
    NewInsuranceSchema   
  )
  .handler(async ({ ctx, input: {  insurance_provider, policy_number, group_number } }) => {
    const { path } = await useServerPath();
    await CreateInsuranceUseCase(ctx.user,{
       insurance_provider, policy_number, group_number
    });
    revalidatePath(`/patient/${path}`);
  });