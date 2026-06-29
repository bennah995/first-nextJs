"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <input name="email" type="email" required placeholder="email" className="w-full border p-2" />
      <input name="password" type="password" required placeholder="password" className="w-full border p-2" />
      <button type="submit" className="w-full bg-brand text-white py-2">Sign in</button>
    </form>
  );
}