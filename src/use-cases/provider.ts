import { createProvider, deleteProvider,  getProviderData,  updateProvider } from "@/data-access/provider";
import { ProviderTypes } from "@/db/schema/provider";



// create provider use case
export const createProviderUseCase = async (UserId: string, providerData: ProviderTypes) => {
    return await createProvider(UserId, providerData);
}   


// update provider use case
export const updateProviderUseCase = async (providerId: string, providerData: ProviderTypes) => {
    return await updateProvider(providerId, providerData);
}   

// delete provider use case
export const deleteProviderUseCase = async (providerId: string) => {
    return await deleteProvider(providerId);
}

// get Provider Data use case
export const getProvidersUseCase = async (providerId: string) => {
    return await getProviderData(providerId);
}