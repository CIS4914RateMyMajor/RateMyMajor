// "use server";
//
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { z } from "zod";
//
// const signUpSchema = z.object({
//   email: z
//     .email("Invalid email address")
//     .endsWith(".edu", "Only .edu email addresses are allowed."),
//   password: z.string().min(8, "Password must be at least 8 characters long"),
//   name: z.string().min(1, "Name is required"),
// });
//
// export type SignUpFormState = {
//   errors?: {
//     email?: string[];
//     password?: string[];
//     name?: string[];
//   };
//   message?: string;
//   fields?: {
//     email?: string;
//     name?: string;
//   };
// } | null;
//
// export async function signUpAction(
//   prevState: SignUpFormState,
//   formData: FormData
// ): Promise<SignUpFormState> {
//   console.log("signUpAction triggered");
//   if (!formData) {
//     return { message: "No form data received." };
//   }
//
//   const rawData = Object.fromEntries(formData.entries());
//   const validatedFields = signUpSchema.safeParse(rawData);
//
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       fields: {
//         email: formData.get("email") as string,
//         name: formData.get("name") as string,
//       },
//     };
//   }
//
//   const { email, password, name } = validatedFields.data;
//
//   try {
//     // 1. Create the user (autoSignIn: false ensures they aren't logged in yet)
//     await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//       },
//     });
//
//     // 2. Manually send the OTP
//     console.log("Triggering OTP send for:", email);
//     await auth.api.sendVerificationOTP({
//         body: {
//             email,
//             type: "email-verification", // This identifies the purpose of the OTP
//         }
//     });
//
//   } catch (e: any) {
//     console.error("SignUp Action Error:", e);
//     if (e.message?.includes("User already exists") || e.code === "USER_ALREADY_EXISTS") {
//       return {
//         message: "Email address is already in use.",
//         fields: { email, name }
//       };
//     }
//
//     return {
//       message: "Failed to sign up. Please try again.",
//     };
//   }
//
//   redirect(`/verify-email?email=${encodeURIComponent(email)}`);
// }
//
// export async function signInAction(formData: FormData) {
//   const email = formData.get("email") as string; // TODO: validate
//   const password = formData.get("password") as string;
//
//   // send to backend
//   await auth.api.signInEmail({
//     body: {
//       email,
//       password,
//     },
//   });
//
//   redirect("/");
// }
//
// export async function signOutAction() {
//     await auth.api.signOut({
//         headers: await headers(),
//     });
//
//     redirect("/");
// }
// src/app/actions/auth.ts

import { redirect } from "next/navigation";

// Define the state type so your components don't error out
export type SignUpFormState = {
  message?: string;
  errors?: Record<string, string[]>;
  fields?: Record<string, any>;
} | null;

export async function signUpAction(prevState: any, formData: FormData) {
  // 1. Simulate a short "network" delay
  await new Promise((res) => setTimeout(res, 800));

  const email = formData.get("email") as string;

  // 2. Mock Logic: Fail if the email doesn't end in .edu
  if (!email.endsWith(".edu")) {
    return {
      message: "Please use a valid .edu email address.",
      errors: { email: ["Invalid domain"] },
      fields: { email }
    };
  }

  // 3. SUCCESS: Redirect to the profile page
  localStorage.setItem("mock_user_logged_in", "true")
  redirect("/profile");

}

export async function signInAction(prevState: any, formData: FormData) {
  await new Promise((res) => setTimeout(res, 800));

  const email = formData.get("email") as string;

  // 4. Mock Logic: Success if email contains 'test'
  if (email.includes("test")) {
    // SUCCESS: Redirect to the schools/majors page
    localStorage.setItem("mock_user_logged_in", "true");
    redirect("/school");
  }

  // FAIL: Return error message
  return {
    message: "Invalid credentials. Hint: use 'test' in the email.",
    errors: { email: ["User not found"] }
  };
}
