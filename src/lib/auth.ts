import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/example-db-interaction"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema/auth-schema";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql", // or "mysql", "sqlite"
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp }, request) {
        console.log(`[AUTH SERVER] Generating OTP for ${email}: "${otp}"`);
        console.log(`Attempting to send OTP to ${email}...`);
        const { data, error } = await resend.emails.send({
          from: "RateMyMajor <ratemymajor@jeremeyang.com>",
          to: email,
          subject: "Verify your email",
          html: `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        });

        if (error) {
          console.error("Resend Error:", error);
        } else {
          console.log("Resend Success:", data);
        }
      },
    }),
  ],
});
