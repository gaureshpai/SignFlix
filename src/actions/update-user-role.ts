"use server";

import { revalidatePath } from "next/cache";
import { UserRoles, userRoleSchema } from "@/lib/validations/user";
import { auth } from "@/auth";
import { updateUserRoleFn } from "@/data-access/user";


export type FormData = {
  role: UserRoles;
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { role } = userRoleSchema.parse(data);

    // Update the user role.
    await updateUserRoleFn(userId,  role );

    revalidatePath("/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}