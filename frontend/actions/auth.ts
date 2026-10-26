"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import type { User } from "@/lib/types";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:8000/api";

export type AuthState = { error?: string } | undefined;

type AuthResponse = { message?: string; token?: string; user?: User };

async function post(
  path: string,
  body: Record<string, string>
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return (await res.json()) as AuthResponse;
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Completa todos los campos." };

  let token = "";
  let message = "";
  try {
    const data = await post("/login", { email, password });
    token = data.token ?? "";
    message = data.message ?? "";
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }

  if (!token) return { error: message || "Credenciales incorrectas." };
  await createSession(token);
  redirect("/");
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || !password) {
    return { error: "Completa todos los campos." };
  }

  let created = false;
  let message = "";
  try {
    const data = await post("/register", { name, email, password });
    created = Boolean(data.user);
    message = data.message ?? "";
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }

  if (!created) return { error: message || "No se pudo crear la cuenta." };
  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}