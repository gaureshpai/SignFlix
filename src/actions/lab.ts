
import {  authenticatedAction } from "@/lib/safe-action";
import { NewLabSchema } from "@/lib/validations/lab";
import { createLabUseCase } from "@/use-cases/lab";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createLabAction = authenticatedAction
  .createServerAction()
  .input(    
    NewLabSchema   
  )
  .handler(async ({ ctx,input: {   test_Name, date_Ordered, test_Code, result,  result_Date,  status,  note } }) => {
    const { path } = await useServerPath();
    await createLabUseCase(ctx.user, {
      test_Name, date_Ordered, test_Code, result, result_Date, note,
      status
    });
    revalidatePath(`/patient/${path}`);
  });