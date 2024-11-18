
import * as z from "zod";

export const UserRoles = z.enum(["patient", "admin", "provider", ])
export type UserRoles = z.infer<typeof UserRoles>;

export const userRoleSchema = z.object({
    role: z.enum(["patient", "admin", "provider", ])
  });

  export const userNameSchema = z.object({
    name: z.string().min(3).max(32),
  });


  export type UpdateUserRoleValues = z.infer<typeof userRoleSchema>;

