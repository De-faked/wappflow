import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // MVP queue: unpaid + not contacted in last 2 days
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const unpaid = await prisma.order.findMany({
    where: { businessId: user.businessId, status: { in: ["new", "confirmed", "delivered"] } },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 10,
  });

  const stale = await prisma.order.findMany({
    where: {
      businessId: user.businessId,
      status: { in: ["new", "confirmed"] },
      OR: [{ lastContactAt: null }, { lastContactAt: { lt: twoDaysAgo } }],
    },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Unpaid / Open orders</h2>
          <p className="text-sm text-gray-600 mt-1">
            Orders not marked as paid yet.
          </p>

          <div className="mt-4 space-y-2">
            {unpaid.length === 0 ? (
              <div className="text-sm text-gray-600">No items.</div>
            ) : (
              unpaid.map((o) => (
                <div key={o.id} className="text-sm">
                  <span className="font-medium">#{o.orderNo}</span> • {o.customer.name} • {o.total.toFixed(2)} • {o.status}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Needs follow-up</h2>
          <p className="text-sm text-gray-600 mt-1">
            New/confirmed orders with no contact for 2+ days.
          </p>

          <div className="mt-4 space-y-2">
            {stale.length === 0 ? (
              <div className="text-sm text-gray-600">No items.</div>
            ) : (
              stale.map((o) => (
                <div key={o.id} className="text-sm">
                  <span className="font-medium">#{o.orderNo}</span> • {o.customer.name} • last contact:{" "}
                  {o.lastContactAt ? new Date(o.lastContactAt).toLocaleDateString() : "never"}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-5">
        <h2 className="font-semibold">Next</h2>
        <p className="text-sm text-gray-600 mt-2">
          The “special” value is that this dashboard always tells you what to do next so you never lose orders inside WhatsApp.
        </p>
      </div>
    </div>
  );
}
