"use client";

import { Suspense } from "react";
import Navbar from "../nav-bar";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // The correct method for email verification via OTP is verifyEmail
    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email: email,
      otp: code,
    });

    if (verifyError) {
      setError(verifyError.message || "The code you entered is invalid or has expired.");
      setLoading(false);
    } else {
      router.push("/profile");
    }
  };

  const handleResend = async () => {
    // Manually trigger a new OTP
    const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification"
    });

    if (resendError) {
        alert("Failed to resend code: " + resendError.message);
    } else {
        alert("Verification code resent. Please check your inbox.");
        setTimer(600);
    }
  };

return (
  <div className="relative min-h-screen text-black">
    {/* Background Layer */}
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

    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-transparent font-sans">
      
      {/* THE BOX: Added border, shadow, and background color */}
      <div className="w-full max-w-md p-8 md:p-10 border-4 border-black bg-[#B1A088] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-8">
        
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight">Verify your email</h1>
          <p className="text-sm font-bold text-black/70">
            Enter the 6-digit code sent to <br/>
            <span className="text-black underline">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              /* Updated Input: Heavy borders and blocky font */
              className="w-full h-14 text-2xl text-center font-black tracking-[0.5em] border-4 border-black bg-white focus:bg-yellow-400 transition-colors outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              autoFocus
              required
            />
            {error && (
              <p className="text-xs font-black uppercase text-red-600 px-1">
                ERROR: {error}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            /* Updated Button: Brutalist style */
            className="w-full h-12 bg-black text-white font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black border-2 border-black transition-all disabled:opacity-50"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Confirm code"}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 pt-6 border-t-4 border-black">
          <div className="text-xs font-black uppercase">
            Expires in: <span className="bg-white px-2 py-1 border-2 border-black">{formatTime(timer)}</span>
          </div>
          <button
            onClick={handleResend}
            disabled={timer > 540}
            className="text-xs font-black uppercase underline hover:no-underline disabled:opacity-30"
          >
            Resend email
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen font-bold uppercase">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
