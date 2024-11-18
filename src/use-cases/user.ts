"use server";

import { UserId } from "@/use-cases/types";
import {  EmailInUseError } from "./errors";
import { createUser, deleteUser,  getUserByEmail,  getUsers, updateUser, userUpdateType } from "@/data-access/user";


export async function deleteUserUseCase(

    userToDeleteId: UserId,
) {
    
    await deleteUser(userToDeleteId);
}


export async function getUsersUseCase() {
    const result = await getUsers();
    return result; 
}


export async function updateUserUseCase(
    userToUpdateId: UserId,
    data: userUpdateType,
) {
    await updateUser(userToUpdateId, data);
}



export async function createUserUseCase(
    data: any
) {
    let existingUser = await getUserByEmail(data.email);

    if (!existingUser) {
        let newUser = await createUser(data);
        return newUser;
    }
    throw new EmailInUseError();
}





