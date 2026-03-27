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
  console.log("signUpAction triggered");
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
    // 1. Create the user (autoSignIn: false ensures they aren't logged in yet)
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    // 2. Manually send the OTP
    console.log("Triggering OTP send for:", email);
    await auth.api.sendVerificationOTP({
        body: {
            email,
            type: "email-verification", // This identifies the purpose of the OTP
        }
    });

  } catch (e: any) {
    console.error("SignUp Action Error:", e);
    if (e.message?.includes("User already exists") || e.code === "USER_ALREADY_EXISTS") {
      return {
        message: "Email address is already in use.",
        fields: { email, name }
      };
    }

    return {
      message: "Failed to sign up. Please try again.",
    };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export type SignInFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  fields?: {
    email?: string;
  };
} | null;

export async function signInAction(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (e: any) {
    console.error("SignIn Action Error:", e);
    return {
      message: "Invalid credentials or verification required.",
      fields: { email },
    };
  }

    redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}
  
