import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "./supabase/server";

export const SESSION_COOKIE_NAME = "riostak_admin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Default fallback admin credentials for bootstrapping
const DEFAULT_BOOTSTRAP_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  username: "sdc",
  passwordPlain: "sdc.123",
  fullName: "SDC Administrator",
  role: "admin",
};

export type AdminUser = {
  id: string;
  username: string;
  fullName: string;
  role: string;
};

export type SessionPayload = {
  user: AdminUser;
  expiresAt: string;
};

/** Get or derive a server signing secret */
function getSigningSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "riostak-secret-academic-institute-key-2026-flourishing"
  );
}

/** Signs a payload using HMAC SHA-256 for tampering prevention. */
function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSigningSecret());
  hmac.update(payload);
  const signature = hmac.digest("base64url");
  return `${payload}.${signature}`;
}

/** Verifies and parses a signed token. Returns null if invalid or tampered with. */
function verifyToken(token: string): string | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);

  const expectedSignature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );
    return isMatch ? payload : null;
  } catch {
    return null;
  }
}

/** Hashes a plain-text password using bcrypt. */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

/** Compares a plain text password against a bcrypt hash. */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/** Authenticates user with username & password against Supabase admin_users table (with bcrypt). */
export async function authenticateAdmin(
  username: string,
  passwordPlain: string
): Promise<{ user: AdminUser } | { error: string }> {
  const cleanUsername = username.trim().toLowerCase();

  try {
    const supabase = await createServerSupabaseClient();
    const { data: dbUser, error } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, full_name, role")
      .ilike("username", cleanUsername)
      .maybeSingle();

    if (!error && dbUser) {
      const isPasswordValid = await verifyPassword(passwordPlain, dbUser.password_hash);
      if (isPasswordValid) {
        return {
          user: {
            id: dbUser.id,
            username: dbUser.username,
            fullName: dbUser.full_name,
            role: dbUser.role,
          },
        };
      }
      return { error: "Invalid username or password." };
    }
  } catch (err) {
    console.warn("Supabase query failed during admin login, falling back to bootstrap check:", err);
  }

  // Resilient fallback for the requested bootstrap user 'sdc' / 'sdc.123'
  if (
    cleanUsername === DEFAULT_BOOTSTRAP_USER.username &&
    passwordPlain === DEFAULT_BOOTSTRAP_USER.passwordPlain
  ) {
    return {
      user: {
        id: DEFAULT_BOOTSTRAP_USER.id,
        username: DEFAULT_BOOTSTRAP_USER.username,
        fullName: DEFAULT_BOOTSTRAP_USER.fullName,
        role: DEFAULT_BOOTSTRAP_USER.role,
      },
    };
  }

  return { error: "Invalid username or password." };
}

/** Creates an authenticated session, records it in admin_sessions (if available), and sets the cookie. */
export async function createAdminSession(user: AdminUser): Promise<void> {
  const cookieStore = await cookies();
  const rawSessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  // Try storing session in admin_sessions table
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("admin_sessions").insert({
      user_id: user.id,
      session_token: rawSessionId,
      expires_at: expiresAt,
    });
  } catch (e) {
    // If table not present yet or offline, HMAC-signed token maintains full security
    console.warn("Could not insert session into admin_sessions table:", e);
  }

  const payload: SessionPayload = {
    user,
    expiresAt,
  };

  const signedCookieValue = signToken(JSON.stringify(payload));

  cookieStore.set(SESSION_COOKIE_NAME, signedCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** Retrieves the current authenticated admin session from the cookie and validates signature & expiration. */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;

  const validPayloadString = verifyToken(cookie.value);
  if (!validPayloadString) return null;

  try {
    const payload: SessionPayload = JSON.parse(validPayloadString);
    if (new Date(payload.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/** Clears the session cookie and signs out the administrator. */
export async function terminateAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
