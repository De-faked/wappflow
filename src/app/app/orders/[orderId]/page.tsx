import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { waLink } from "@/lib/whatsapp";
import { headers } from "next/headers";

export default async function OrderInvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: user.businessId },
    include: { customer: true, items: true, business: true },
  });

  if (!order) redirect("/app/orders");

  const invoiceUrl = `/api/invoice/${order.id}`;
  const message = `السلام عليكم\nهذه فاتورة الطلب رقم #${order.orderNo} من ${order.business.name}.\nالمبلغ: ${order.total.toFixed(
    2
  )} ${order.business.currency}\nيمكنك تنزيل الفاتورة من الرابط، ثم أرسل صورة الإيصال هنا بعد الدفع.\n${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${invoiceUrl}`;

  const whatsapp = waLink(order.customer.phoneE164, message);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Invoice</h1>
        <p className="text-sm text-gray-600 mt-1">
          Order #{order.orderNo} • {order.customer.name}
        </p>
      </div>

      <div className="rounded-2xl border p-5 space-y-3">
        <div className="text-sm">
          <div className="font-semibold">{order.business.name}</div>
          <div className="text-gray-600">Customer: {order.customer.name}</div>
          <div className="text-gray-600">Phone: {order.customer.phoneE164}</div>
        </div>

        <div className="text-sm space-y-1">
          {order.items.map((i) => (
            <div key={i.id}>
              {i.name} • qty {i.qty} • unit {i.unitPrice.toFixed(2)} • total {(i.qty * i.unitPrice).toFixed(2)}
            </div>
          ))}
        </div>

        <div className="font-semibold">
          Total: {order.total.toFixed(2)} {order.business.currency}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <a className="rounded-lg bg-black text-white px-4 py-2" href={invoiceUrl}>
            Download PDF
          </a>
          <a className="rounded-lg border px-4 py-2" href={whatsapp} target="_blank" rel="noreferrer">
            WhatsApp: Send invoice link
          </a>
          <a className="rounded-lg border px-4 py-2" href="/app/orders">
            Back to orders
          </a>
        </div>

        <p className="text-xs text-gray-600 pt-2">
          Note: invoice link is local right now. After deployment, we will set NEXT_PUBLIC_APP_URL to your real domain.
        </p>
      </div>
    </div>
  );
}
