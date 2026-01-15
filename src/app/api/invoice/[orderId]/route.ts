import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { buildInvoicePdf } from "@/lib/invoice";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: { id: orderId, businessId: user.businessId },
    include: { customer: true, items: true, business: true },
  });

  if (!order) return new NextResponse("Not found", { status: 404 });

  const bytes = await buildInvoicePdf({
    businessName: order.business.name,
    currency: order.business.currency,
    orderNo: order.orderNo,
    customerName: order.customer.name,
    customerPhone: order.customer.phoneE164,
    items: order.items.map((i) => ({ name: i.name, qty: i.qty, unitPrice: i.unitPrice })),
    total: order.total,
    issuedAtISO: new Date().toISOString().slice(0, 10),
  });

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice_${order.orderNo}.pdf"`,
    },
  });
}
