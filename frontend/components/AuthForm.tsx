"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "@/actions/auth";
import type { AuthState } from "@/actions/auth";

type Props = { mode: "login" | "register"; registered?: boolean };

export default function AuthForm({ mode, registered }: Props) {
  const isLogin = mode === "login";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    isLogin ? loginAction : registerAction,
    undefined
  );

  return (
    <form
      action={formAction}
      className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-3 rounded-lg border p-6"
    >
      <h1 className="text-xl font-bold">
        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </h1>
      {registered && (
        <p className="text-sm text-green-600">
          Cuenta creada. Ya puedes iniciar sesión.
        </p>
      )}
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {!isLogin && (
        <input
          name="name"
          placeholder="Nombre (mín. 5 caracteres)"
          required
          className="rounded border p-2 text-black"
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded border p-2 text-black"
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña (mín. 8, mayús, número, símbolo)"
        required
        className="rounded border p-2 text-black"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 p-2 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Enviando..." : isLogin ? "Entrar" : "Crear cuenta"}
      </button>
      <Link
        href={isLogin ? "/register" : "/login"}
        className="text-sm text-blue-500 underline"
      >
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </Link>
    </form>
  );
}