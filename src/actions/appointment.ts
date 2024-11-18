
import { insertAppointmentSchema } from "@/db/schema/appointment";
import { authenticatedAction } from "@/lib/safe-action";
import { useServerPath } from "@/lib/utils";
import { bookAppointmentUseCase } from "@/use-cases/appointment";
import { revalidatePath } from "next/cache";



export const bookAppointmentAction = authenticatedAction 
  .createServerAction()
  .input(
    insertAppointmentSchema
  )
  .handler(async ({ ctx,input: {  reason,  provider_id, type, status, notes, scheduled_date, timeSlotIndex, location, patient_id,id } }) => {
    const { path } = await useServerPath();
    await bookAppointmentUseCase( ctx.user, {
      
        reason, provider_id, type, status, notes, scheduled_date, timeSlotIndex, location, patient_id, id,
    });
    revalidatePath(`/patient/${path}`);
  });
