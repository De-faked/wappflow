"use client";

import { useActionState } from "react";
import { createCustomerAction } from "@/app/app/actions";

const initialState = { ok: true, error: "" };

export function NewCustomerForm() {
    const [state, action, pending] = useActionState(createCustomerAction as any, initialState);

    return (
        <div className="rounded-2xl border p-5">
            <h2 className="font-semibold">Add customer</h2>

            {state?.error ? (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {state.error}
                </div>
            ) : null}

            <form action={action} className="mt-4 grid gap-3">
                <input
                    name="name"
                    className="rounded-lg border px-3 py-2"
                    placeholder="Name"
                    required
                />
                <input
                    name="phoneE164"
                    className="rounded-lg border px-3 py-2"
                    placeholder="+9665..."
                    required
                />
                <input
                    name="notes"
                    className="rounded-lg border px-3 py-2"
                    placeholder="Notes (optional)"
                />
                <button
                    disabled={pending}
                    className="rounded-lg bg-black text-white py-2 disabled:opacity-50"
                >
                    {pending ? "Creating..." : "Create"}
                </button>
            </form>

            <p className="text-xs text-gray-600 mt-3">
                Phone must be E.164 format, e.g. +9665xxxxxxx.
            </p>
        </div>
    );
}
