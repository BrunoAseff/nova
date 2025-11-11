import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/server/db";
import { Resend } from "resend";
import ResetPasswordEmail from "@/lib/emails/reset-password";
import { env } from "../../../env";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a reset email has been sent" },
        { status: 200 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await db.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    const resetUrl = `${env.NEXTAUTH_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Reset your password",
      react: ResetPasswordEmail({ url: resetUrl }),
    });

    return NextResponse.json({ message: "Reset email sent" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to send reset email" },
      { status: 500 },
    );
  }
}
