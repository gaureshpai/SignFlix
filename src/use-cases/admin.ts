// create admin use case

import { createAdmin, deleteAdmin, getAdminById, updateAdmin } from "@/data-access/admin";
import { AdminTypes } from "@/db/schema/admin";


export const getAdmin = async (adminId: string) => {
    return await getAdminById(adminId);
};

export const updateAdminUseCase = async (adminId: string, adminData: AdminTypes) => {
    return await updateAdmin(adminId, adminData);
};

export const deleteAdminUseCase = async (adminId: string) => {
    return await deleteAdmin(adminId);
}

export const createAdminUseCase = async (UserId: string, adminData: AdminTypes) => {
    return await createAdmin(UserId, adminData);
}   

