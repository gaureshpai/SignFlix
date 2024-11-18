"use server";

import { auth } from "@/auth";
import { updateUserNameFn } from "@/data-access/user";
import { userNameSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";


export type FormData = {
  name: string;
};

export async function updateUserName(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }
       const { name } = userNameSchema.parse(data);

    // Update the user name.
    await updateUserNameFn(userId, name);

    revalidatePath('/settings');
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" }
  }
}