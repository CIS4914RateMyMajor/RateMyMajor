"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  email: z
    .email("Invalid email address")
    .endsWith(".edu", "Only .edu email addresses are allowed."),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1, "Name is required"),
});

export type SignUpFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
  message?: string;
  fields?: {
    email?: string;
    name?: string;
  };
} | null;

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  if (!formData) {
    return { message: "No form data received." };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = signUpSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fields: {
        email: formData.get("email") as string,
        name: formData.get("name") as string,
      },
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // send to backend
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
  } catch (e) {
    return {
      message: "Failed to sign up. Please try again.",
    };
  }

  redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string; // TODO: validate
  const password = formData.get("password") as string;

  // send to backend
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  redirect("/");
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });

    redirect("/");
}