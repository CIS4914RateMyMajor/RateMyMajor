"use client";

import { useActionState } from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import Navbar from "../nav-bar";
import { signInAction, type SignInFormState } from "../actions/auth"; // Ensure this matches your sign-in action signature

export default function SignInPage() {
    // Use useActionState to mirror the Sign Up logic
    // Note: Ensure your signInAction returns a compatible state object (errors, fields, etc.)
    const [state, action, isPending] = useActionState<SignInFormState, FormData>(
        signInAction,
        null
    );

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <h1 className="text-2xl font-bold">Sign In</h1>
                <form action={action} className="flex flex-col gap-3 w-64" noValidate>

                    {/* Email Field */}
                    <div className="flex flex-col gap-1">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            defaultValue={state?.fields?.email}
                        />
                        {state?.errors?.email && (
                            <p className="text-red-500 text-xs">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                        {state?.errors?.password && (
                            <p className="text-red-500 text-xs">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* General Error Message */}
                    {state?.message && (
                        <p className="text-red-500 text-sm text-center">{state.message}</p>
                    )}

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

