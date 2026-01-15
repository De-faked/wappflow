"use server";

import { prisma } from "@/lib/db";
import { SignupSchema, LoginSchema } from "@/lib/validation";
import { createSession, hashPassword, verifyPassword, logout as doLogout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const parsed = SignupSchema.safeParse({
    businessName: formData.get("businessName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid input. Check email/password and try again." };
  }

  const { businessName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Email already registered." };

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: { name: businessName, currency: "SAR", locale: "ar" },
    });

    await tx.sequence.create({
      data: { businessId: business.id, key: "orderNo", nextVal: 1 },
    });

    return tx.user.create({
      data: {
        businessId: business.id,
        email,
        passwordHash,
        role: "owner",
      },
    });
  });

  await createSession(user.id);
  redirect("/app");
}

export async function loginAction(formData: FormData) {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { ok: false, error: "Invalid input." };

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Wrong email or password." };

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { ok: false, error: "Wrong email or password." };

  await createSession(user.id);
  redirect("/app");
}

export async function logoutAction() {
  await doLogout();
  redirect("/login");
}
