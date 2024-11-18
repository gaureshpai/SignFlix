
import { UserTable } from "@/db/schema";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: (typeof UserTable.$inferSelect)["role"];
  id: (typeof UserTable.$inferSelect)["id"];
  email: (typeof UserTable.$inferSelect)["email"];
};

declare module "next-auth/jwt" {
  interface JWT {
    role: (typeof UserTable.$inferSelect)["role"];
    id: (typeof UserTable.$inferSelect)["id"];
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}