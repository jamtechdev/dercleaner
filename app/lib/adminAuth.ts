import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE_NAME = "dc_admin";

function secret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.AUTH_SECRET ||
    // dev fallback (change in production!)
    "dev-secret-change-me"
  );
}

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function unbase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function hmac(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function setAdminSession(ttlMs = 1000 * 60 * 60 * 24 * 7) {
  const payload = JSON.stringify({ exp: Date.now() + ttlMs });
  const data = base64url(payload);
  const sig = hmac(data);

  throw new Error("setAdminSession must be awaited (use setAdminSessionAsync)");
}

export function clearAdminSession() {
  throw new Error("clearAdminSession must be awaited (use clearAdminSessionAsync)");
}

export async function setAdminSessionAsync(
  ttlMs = 1000 * 60 * 60 * 24 * 7,
) {
  const payload = JSON.stringify({ exp: Date.now() + ttlMs });
  const data = base64url(payload);
  const sig = hmac(data);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${data}.${sig}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearAdminSessionAsync() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  const [data, sig] = cookie.split(".");
  if (!data || !sig) return false;
  if (!timingSafeEqual(hmac(data), sig)) return false;

  try {
    const payload = JSON.parse(unbase64url(data));
    return typeof payload?.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminAuthed())) {
    redirect("/admin-login");
  }
}
