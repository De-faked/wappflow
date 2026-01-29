"use client";

import { useActionState } from "react";
import { createOrderAction } from "@/app/app/actions";

const initialState = { ok: true, error: "" };

type Props = {
    customers: { id: string; name: string; phoneE164: string }[];
};

export function NewOrderForm({ customers }: Props) {
    const [state, action, pending] = useActionState(createOrderAction as any, initialState);

    if (customers.length === 0) {
        return (
            <div className="rounded-2xl border p-5">
                <h2 className="font-semibold">Create order</h2>
                <p className="text-sm text-gray-600 mt-3">Create a customer first.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border p-5">
            <h2 className="font-semibold">Create order</h2>

            {state?.error ? (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                    {state.error}
                </div>
            ) : null}

            <form action={action} className="mt-4 grid gap-3">
                <label className="text-sm font-medium">Customer</label>
                <select name="customerId" className="rounded-lg border px-3 py-2" required>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.phoneE164})
                        </option>
                    ))}
                </select>

                <label className="text-sm font-medium">Status</label>
                <select name="status" className="rounded-lg border px-3 py-2">
                    <option value="new">new</option>
                    <option value="confirmed">confirmed</option>
                    <option value="delivered">delivered</option>
                    <option value="paid">paid</option>
                    <option value="lost">lost</option>
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                        <label className="text-sm font-medium">Item</label>
                        <input
                            name="itemName"
                            className="mt-2 rounded-lg border px-3 py-2 w-full"
                            placeholder="e.g., Oud 50g"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Qty</label>
                        <input
                            name="qty"
                            type="number"
                            min="1"
                            defaultValue={1}
                            className="mt-2 rounded-lg border px-3 py-2 w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Unit price</label>
                    <input
                        name="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={0}
                        className="mt-2 rounded-lg border px-3 py-2 w-full"
                    />
                </div>

                <button
                    disabled={pending}
                    className="rounded-lg bg-black text-white py-2 disabled:opacity-50"
                >
                    {pending ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}
