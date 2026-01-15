import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createCustomerAction } from "@/app/app/actions";

export default async function CustomersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const customers = await prisma.customer.findMany({
    where: { businessId: user.businessId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Customers</h1>

      <div className="rounded-2xl border p-5">
        <h2 className="font-semibold">Add customer</h2>

        <form action={createCustomerAction} className="mt-4 grid gap-3">
          <input name="name" className="rounded-lg border px-3 py-2" placeholder="Name" required />
          <input name="phoneE164" className="rounded-lg border px-3 py-2" placeholder="+9665..." required />
          <input name="notes" className="rounded-lg border px-3 py-2" placeholder="Notes (optional)" />
          <button className="rounded-lg bg-black text-white py-2">Create</button>
        </form>

        <p className="text-xs text-gray-600 mt-3">
          Phone must be E.164 format, e.g. +9665xxxxxxx.
        </p>
      </div>

      <div className="rounded-2xl border">
        <div className="p-4 border-b font-semibold">Customer list</div>
        <div className="divide-y">
          {customers.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No customers yet.</div>
          ) : (
            customers.map((c) => (
              <div key={c.id} className="p-4">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">{c.phoneE164}</div>
                {c.notes ? <div className="text-sm text-gray-700 mt-1">{c.notes}</div> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
