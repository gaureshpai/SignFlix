// create insurance use case

import  { InsuranceType, newInsuranceType } from "@/db/schema/insurance";

import { CreateInsurance, DeleteInsurance, getInsuranceById, UpdateInsurance } from "@/data-access/insurance";
import { selectInsuranceSchema } from "@/db/schema/insurance";
import { ExtendedUser } from "@/types/next-auth";

export const CreateInsuranceUseCase = async ( user: ExtendedUser, insuranceData: newInsuranceType) => {
  if (user && user.role !== "provider") {
    throw new Error("Only providers can create diagnoses");
  }
  const insurance = await CreateInsurance(insuranceData );
  return insurance;

    }
       

    // update insurance use case

    export const UpdateInsuranceUseCase = async ( insuranceData: InsuranceType) => {   
      const insurance = await UpdateInsurance(insuranceData );
      return insurance;
    }
    

    // delete insurance use case

    export const DeleteInsuranceUseCase = async (insuranceId: string) => {
      await DeleteInsurance(insuranceId);
    }

    // get insurance use case

    export const GetInsuranceUseCase = async (insuranceId: string) => {
      const insurance = await getInsuranceById(insuranceId);
      return insurance;
    }