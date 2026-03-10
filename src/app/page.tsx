import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "@/features/shared/components/ui/button";
import { auth } from "@/lib/auth";

import { signOutAction } from "./actions/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">RATE MY MAJOR TODO</h1>
        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">RATE MY MAJOR TODO</h1>
      <div className="mt-6 text-center space-y-6">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-slate-800 tracking-tight">
            Hello, {session.user.name}!
          </p>
          <p className="text-slate-500">USER LOGGED IN TODO</p>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <Button asChild variant="outline" size="lg" className="w-full max-w-[200px]">
            <Link href="/profile">View Profile</Link>
          </Button>
          
          <form action={signOutAction} className="w-full max-w-[200px]">
            <Button type="submit" size="lg" variant="destructive" className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
