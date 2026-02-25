"use server";

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
    const email = formData.get("email") as string; // TODO: validate
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // send to backend
    await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        }
    })

    redirect("/")
}