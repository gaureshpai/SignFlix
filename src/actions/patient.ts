import { authenticatedAction } from "@/lib/safe-action"
import { NewPatientSchema } from "@/lib/validations/patient";
import { createPatientUseCase } from "@/use-cases/patient";
import { revalidatePath } from "next/cache";
import { useServerPath } from "@/lib/utils";



export const createPatientAction = authenticatedAction
    .createServerAction()
    .input(
             NewPatientSchema
      )
      .handler(async ({ ctx,input:         {      
        full_name,
        email,
        gender,
        date_of_birth,
        phone_number,
        address,
        height,
        weight,
        occupation,
        marital_status,
        emergency_contact_name,
        emergency_contact_relationship,
        emergency_contact_number,
        socialHistory,
        past_medical_history,
        family_medical_history,
        blood_type,
        primary_care_physician,
        preferred_language, notes }
       }) => {
        const { path } = await useServerPath();
        await createPatientUseCase( ctx.user,{
          full_name,
          email,
          gender,
          date_of_birth,
          phone_number,
          address,
          height,
          weight,
          occupation,
          marital_status,
          emergency_contact_name,
          emergency_contact_relationship,
          emergency_contact_number,
          socialHistory,
          past_medical_history,
          family_medical_history,
          blood_type,
          primary_care_physician,
          preferred_language,
          notes
        });
        revalidatePath(`/patient/${path}`);
      });