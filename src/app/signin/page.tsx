"use client";

import { useActionState } from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import Navbar from "../nav-bar";
import { signInAction, type SignInFormState } from "../actions/auth"; // Ensure this matches your sign-in action signature

export default function SignInPage() {
    const [state, action, isPending] = useActionState<SignInFormState, FormData>(
        signInAction,
        null
    );

    return (
        <div className="relative min-h-screen text-black">
  <div 
    className="fixed inset-0 pointer-events-none"
    style={{
      backgroundImage: "url('/art_assets/bkgd.png')", 
      backgroundSize: '400px',
      backgroundRepeat: 'repeat',
      opacity: 0.15,
      zIndex: -1, 
    }}
  />
            <Navbar />
            <main className="max-w-6xl mx-auto p-8">
                <div className="max-w-xl mx-auto border-6 border-black p-8 md:p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <header className="mb-8 border-b-4 border-black pb-5 text-center">
                        <h1 className="text-4xl font-black tracking-tight uppercase leading-none mb-3">Login</h1>
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">
                    Welcome back to RateMyMajor
                    </p>
                    </header>

                    <form action={action} className="flex flex-col gap-4" noValidate>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email</label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            defaultValue={state?.fields?.email}
                            className="border-2 border-black rounded-none h-12"
                        />
                        {state?.errors?.email && (
                            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Password</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="border-2 border-black rounded-none h-12"
                        />
                        {state?.errors?.password && (
                            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* General Error Message */}
                    {state?.message && (
                        <p className="bg-red-50 border-4 border-red-500 p-3 text-red-700 font-bold text-sm text-center uppercase tracking-wide">
                            {state.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 border-4 border-black rounded-none bg-yellow-400 text-black font-black uppercase tracking-wide hover:bg-black hover:text-white"
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                </div>
            </main>
            </div>
    );
}

