"use server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";

export async function loginAction(fd: FormData) {
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");

  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const c = await cookies();

  c.set("accessToken", data.accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15,
  });

  c.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true };
}
