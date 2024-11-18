import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import dotenv from 'dotenv';

dotenv.config();

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET           
        }),
    ],
    trustHost: true,
} satisfies NextAuthConfig;