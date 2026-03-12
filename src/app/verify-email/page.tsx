"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";

export default function VerifyEmailPage() {
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
    const { data, error: verifyError } = await authClient.emailOtp.verifyEmail({
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white font-sans text-slate-900">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="h-12 text-lg text-center tracking-widest border-slate-200 focus:ring-slate-400"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              autoFocus
              required
            />
            {error && (
              <p className="text-xs font-medium text-red-600 px-1">
                {error}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Confirm code"}
          </Button>
        </form>

        <div className="flex flex-col items-start gap-4 pt-6 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            Expires in <span className="font-mono text-slate-600">{formatTime(timer)}</span>
          </div>
          <button
            onClick={handleResend}
            disabled={timer > 540}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 disabled:opacity-50 transition-colors"
          >
            Didn&apos;t get a code? Resend email
          </button>
        </div>
      </div>
    </div>
  );
}
