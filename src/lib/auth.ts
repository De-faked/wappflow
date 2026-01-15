import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "wf_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string, days = 14) {
  const token = newToken();
  const tokenHash = sha256(token);

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true when deployed with HTTPS
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = sha256(token);

  const sess = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: { include: { business: true } } },
  });

  if (!sess) return null;
  if (sess.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { tokenHash } });
    return null;
  }

  return sess.user;
}

export async function logout() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = sha256(token);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }
  (await cookies()).delete(SESSION_COOKIE);
}
