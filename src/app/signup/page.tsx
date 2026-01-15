"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/app/(auth)/actions";

type AuthState = { ok: boolean; error?: string };

const initialState: AuthState = { ok: true, error: "" };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction as any, initialState);

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create your business workspace (mobile-first).
        </p>

        {state?.error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        ) : null}

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Business name</label>
            <input
              name="businessName"
              type="text"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Demo Shop"
              autoComplete="organization"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
