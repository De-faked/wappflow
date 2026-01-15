import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrderAction, touchLastContactAction } from "@/app/app/actions";
import { waLink, msgNewOrder, msgFollowUp, msgPaymentReminder } from "@/lib/whatsapp";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const customers = await prisma.customer.findMany({
    where: { businessId: user.businessId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, phoneE164: true },
  });

  const orders = await prisma.order.findMany({
    where: { businessId: user.businessId },
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Orders</h1>

      <div className="rounded-2xl border p-5">
        <h2 className="font-semibold">Create order</h2>

        {customers.length === 0 ? (
          <p className="text-sm text-gray-600 mt-3">
            Create a customer first.
          </p>
        ) : (
          <form action={createOrderAction} className="mt-4 grid gap-3">
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
                <input name="itemName" className="mt-2 rounded-lg border px-3 py-2 w-full" placeholder="e.g., Oud 50g" required />
              </div>
              <div>
                <label className="text-sm font-medium">Qty</label>
                <input name="qty" type="number" min="1" defaultValue={1} className="mt-2 rounded-lg border px-3 py-2 w-full" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Unit price</label>
              <input name="unitPrice" type="number" min="0" step="0.01" defaultValue={0} className="mt-2 rounded-lg border px-3 py-2 w-full" />
            </div>

            <button className="rounded-lg bg-black text-white py-2">Create</button>
          </form>
        )}
      </div>

      <div className="rounded-2xl border">
        <div className="p-4 border-b font-semibold">Recent orders</div>
        <div className="divide-y">
          {orders.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">No orders yet.</div>
          ) : (
            orders.map((o) => {
              const phone = o.customer.phoneE164;
              const businessName = user.business.name;

              const newOrderLink = waLink(phone, msgNewOrder(businessName, o.orderNo, o.total));
              const followUpLink = waLink(phone, msgFollowUp(o.orderNo));
              const payLink = waLink(phone, msgPaymentReminder(o.orderNo, o.total));

              return (
                <div key={o.id} className="p-4 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">
                        #{o.orderNo} • {o.customer.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Status: {o.status} • Total: {o.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last contact: {o.lastContactAt ? new Date(o.lastContactAt).toLocaleString() : "never"}
                      </div>
                    </div>

                    <form action={async () => { "use server"; await touchLastContactAction(o.id); }}>
                      <button className="rounded-lg border px-3 py-2 text-sm">
                        Mark contacted now
                      </button>
                    </form>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a className="rounded-lg border px-3 py-2 text-sm" href={`/app/orders/${o.id}`}>
                      Invoice
                    </a>
                    <a className="rounded-lg border px-3 py-2 text-sm" href={newOrderLink} target="_blank" rel="noreferrer">
                      WhatsApp: New order
                    </a>
                    <a className="rounded-lg border px-3 py-2 text-sm" href={followUpLink} target="_blank" rel="noreferrer">
                      WhatsApp: Follow up
                    </a>
                    <a className="rounded-lg border px-3 py-2 text-sm" href={payLink} target="_blank" rel="noreferrer">
                      WhatsApp: Payment reminder
                    </a>
                  </div>

                  <div className="text-xs text-gray-600">
                    Items: {o.items.map(i => `${i.name} x${i.qty}`).join(", ")}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
