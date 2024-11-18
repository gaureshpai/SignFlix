
import {  authenticatedAction } from "@/lib/safe-action";
import { selectMedicationSchema } from "@/lib/validations/medication";
import { createMedicationUseCase } from "@/use-cases/medication";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createMedicationAction = authenticatedAction
  .createServerAction()
  .input(    
    selectMedicationSchema   
  )
  .handler(async ({ ctx, input: {  medication_name, code, dosage, frequency, route, status, note, start_date, end_date} }) => {
    const { path } = await useServerPath();
    await createMedicationUseCase(ctx.user,{
       medication_name, code, dosage, frequency, route, status, note, start_date, end_date
    });
    revalidatePath(`/patient/${path}`);
  });
