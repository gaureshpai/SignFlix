
import { getUsers, updateUser } from "@/data-access/user"
import { authenticatedAction } from "@/lib/safe-action"
import { z } from "zod"



export const updateEmail = authenticatedAction 
  .createServerAction()  
  .input(z.object({
    newEmail: z.string()
  })).handler(async ({input, ctx}) => {    const {user} = ctx

    // Update user's email in the database
    if (user) {
      // Update user's email in the database
      updateUser(user.id, {email: input.newEmail })
    } else {
      // Handle the case when user is undefined
      throw new Error('User is not authenticated');
    }

    return input.newEmail
  })


 
