import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // 1. Get the session directly in the Server Component
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/signin");
  }

  const { user } = session;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 text-center">User Profile</h1>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-2 border-slate-100 mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account ID</label>
              <p className="text-sm font-mono text-slate-600 bg-slate-50 p-2 rounded mt-1 overflow-x-auto">
                {user.id}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Status</label>
              <p className="text-sm text-slate-600 mt-1">
                {user.emailVerified ? (
                  <span className="text-green-600 flex items-center gap-1">
                    Verified
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    Unverified
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Joined On</label>
              <p className="text-sm text-slate-600 mt-1">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
