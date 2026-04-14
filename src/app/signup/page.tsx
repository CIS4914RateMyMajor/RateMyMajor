"use client";

import { useActionState } from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import Navbar from "../nav-bar";
import { signUpAction, type SignUpFormState } from "../actions/auth";


export default function SignUpPage() {
  const [state, action, isPending] = useActionState<SignUpFormState, FormData>(
    signUpAction,
    null
  );

  return (
      <div className="min-h-screen bg-white text-black font-sans">
        <Navbar />
        <main className="max-w-6xl mx-auto p-8">
          <div className="max-w-xl mx-auto border-6 border-black p-8 md:p-10 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <header className="mb-8 border-b-4 border-black pb-5 text-center">
              <h1 className="text-4xl font-black tracking-tight uppercase leading-none mb-3">Sign Up</h1>
              <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">
                Create your RateMyMajor account
              </p>
            </header>

      <form action={action} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500">Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Name"
            required
            defaultValue={state?.fields?.name}
            className="border-2 border-black rounded-none h-12"
          />
          {state?.errors?.name && (
            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email (.edu)</label>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.edu$"
            title="Please enter a valid email ending in .edu"
            defaultValue={state?.fields?.email}
            className="border-2 border-black rounded-none h-12"
          />
          {state?.errors?.email && (
            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
            className="border-2 border-black rounded-none h-12"
          />
          {state?.errors?.password && (
            <p className="text-red-600 text-xs font-bold uppercase tracking-wide">{state.errors.password[0]}</p>
          )}
        </div>

        {state?.message && (
          <p className="bg-red-50 border-4 border-red-500 p-3 text-red-700 font-bold text-sm text-center uppercase tracking-wide">
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 border-4 border-black rounded-none bg-white text-black font-black uppercase tracking-wide hover:bg-black hover:text-white"
        >
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
          </div>
        </main>
      </div>
  );
}
