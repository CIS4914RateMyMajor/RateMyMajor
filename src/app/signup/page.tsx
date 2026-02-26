"use client";

import { useActionState } from "react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

import { signUpAction, type SignUpFormState } from "../actions/auth";

export default function SignUpPage() {
  const [state, action, isPending] = useActionState<SignUpFormState, FormData>(
    signUpAction,
    null
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form action={action} className="flex flex-col gap-3 w-64" noValidate>
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            required
            defaultValue={state?.fields?.name}
          />
          {state?.errors?.name && (
            <p className="text-red-500 text-xs">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.edu$"
            title="Please enter a valid email ending in .edu"
            defaultValue={state?.fields?.email}
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-xs">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={8}
          />
          {state?.errors?.password && (
            <p className="text-red-500 text-xs">{state.errors.password[0]}</p>
          )}
        </div>

        {state?.message && (
          <p className="text-red-500 text-sm text-center">{state.message}</p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
