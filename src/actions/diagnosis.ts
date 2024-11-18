import {  authenticatedAction } from "@/lib/safe-action";
import { createDiagnosisUseCase } from "@/use-cases/diagnosis";

import { revalidatePath } from "next/cache";

import { useServerPath } from "@/lib/utils";
import { insertDiagnosisSchema } from "@/db/schema/diagnosis";


export const createDiagnosisAction = authenticatedAction
  .createServerAction()
  .input(    
    insertDiagnosisSchema
  )
  .handler(async ({ ctx, input: { diagnosis_name, diagnosis_code,  severity, note } }) => {
    const { path } = await useServerPath();
    await createDiagnosisUseCase(ctx.user,{
       diagnosis_name, diagnosis_code,  severity, note
    });
    revalidatePath(`/patient/${path}`);
  });
