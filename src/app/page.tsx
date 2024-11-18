"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/shared/icons";

export default function Login() {
    const [signInClicked, setSignInClicked] = useState(false);
    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            redirect("/landing");
        }
    }, [status]);

    // Show loading state while checking session
    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center">
                <Icons.spinner className="size-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-1/4 m-auto rounded-md border-black border-2 justify-center items-center">
                <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
                    <a href={siteConfig.url}>
                        <Icons.logo className="size-10" />
                    </a>
                    <h3 className="font-satoshi text-2xl font-black">
                        Sign In
                    </h3>
                    <p className="text-sm text-gray-500">
                        This is strictly for demo purposes - only your email and profile
                        picture will be stored.
                    </p>
                </div>

                <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
                    <Button
                        variant="default"
                        disabled={signInClicked}
                        onClick={() => {
                            setSignInClicked(true);
                            signIn("google", { callbackUrl: "/landing" });
                        }}
                    >
                        {signInClicked ? (
                            <Icons.spinner className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 size-4" />
                        )}{" "}
                        Sign In with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}