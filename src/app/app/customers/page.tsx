import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createCustomerAction } from "@/app/app/actions";
import { NewCustomerForm } from "./new-customer-form";

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

      <NewCustomerForm />

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
