"use server"

import { assertAuthenticated, getCurrentUser, getUserRole } from "@/lib/session";
import { AuthenticationError, PublicError } from "@/use-cases/errors";
import { createServerActionProcedure } from "zsa";



function shapeErrors({ err }: any) {
    const isAllowedError = err instanceof PublicError;
    // let's all errors pass through to the UI so debugging locally is easier
    const isDev = process.env.NODE_ENV === "development";
    if (isAllowedError || isDev) {
        console.error(err);
        return {
            code: err.code ?? "ERROR",
            message: `${isDev ? "DEV ONLY ENABLED - " : ""}${err.message}`,
        };
    } else {
        return {
            code: "ERROR",
            message: "Something went wrong",
        };
    }
}

export const authenticatedAction = createServerActionProcedure()
    .experimental_shapeError(shapeErrors)
    .handler(async () => {
        const user = await assertAuthenticated();
        return { user };
    });

export const unauthenticatedAction = createServerActionProcedure()
    .experimental_shapeError(shapeErrors)
    .handler(async () => {
        return { user: undefined };
    });

export const isAdminProcedure = createServerActionProcedure(authenticatedAction)
    .experimental_shapeError(shapeErrors)
    .handler(async ({ ctx }) => {
        const user = await getUserRole(ctx.user.role);
        if (user.role !== "admin") {
            throw new AuthenticationError();
        }
        return { user: {
            id: ctx.user.id,
            email: ctx.user.email,
            role: ctx.user.role
        } 
    };
    }
    )


export const isProviderProcedure = createServerActionProcedure(authenticatedAction)
    .experimental_shapeError(shapeErrors)
    .handler(async ({ ctx }) => {
        const user = await getUserRole(ctx.user.role);
        if (user.role !== "provider") {
            throw new AuthenticationError();
        }
        return { user: {
            id: ctx.user.id,
            email: ctx.user.email,
            role: ctx.user.role
        }  };
    }
    )


export const isPatientProcedure = createServerActionProcedure(authenticatedAction)
    .experimental_shapeError(shapeErrors)
    .handler(async ({ ctx }) => {
        const user = await getUserRole(ctx.user.role);
        if (user.role !== "patient") {
            throw new AuthenticationError();
        }
        return { user: {
            id: ctx.user.id,
            email: ctx.user.email,
            role: ctx.user.role
        }  };
    }
    )