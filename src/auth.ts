
import db from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import { getUserById } from "./data-access/user";
import authConfig from "./auth.config";
import { UserRoles } from "./lib/validations/user";



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db) ,
  session: { strategy: "jwt" },
 pages: {
    signIn: "/",

  }, 
  secret: process.env.AUTH_SECRET,


  callbacks: {
    async session({ token, session }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role  ) {
          session.user.role = token.role as UserRoles
        }

        session.user.name = token.name;
        session.user.image = token.picture;
        
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;      

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;
     
     
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      return token;
    },
  },
  ...authConfig,
});
