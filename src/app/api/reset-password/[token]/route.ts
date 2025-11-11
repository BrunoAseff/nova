import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { password } = await req.json();
    const { token } = await context.params;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 422 },
      );
    }

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbersOrSymbols = /[\d\W]/.test(password);
    if (!hasLetters || !hasNumbersOrSymbols) {
      return NextResponse.json(
        {
          error: "Password must contain letters and numbers or symbols",
        },
        { status: 422 },
      );
    }

    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
