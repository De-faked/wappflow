"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { nextOrderNo } from "@/lib/sequence";

function requireUser() {
  return getCurrentUser();
}

export async function createCustomerAction(formData: FormData) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  const phoneE164 = String(formData.get("phoneE164") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name || name.length < 2) return;
  if (!phoneE164.startsWith("+") || phoneE164.length < 8) return;

  await prisma.customer.create({
    data: {
      businessId: user.businessId,
      name,
      phoneE164,
      notes,
    },
  });

  redirect("/app/customers");
}

export async function createOrderAction(formData: FormData) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const customerId = String(formData.get("customerId") || "").trim();
  const status = String(formData.get("status") || "new").trim();
  const itemName = String(formData.get("itemName") || "").trim();
  const qty = Number(formData.get("qty") || 1);
  const unitPrice = Number(formData.get("unitPrice") || 0);

  if (!customerId) return;
  if (!itemName) return;

  const orderNo = await nextOrderNo(user.businessId);

  const total = Math.max(0, qty) * Math.max(0, unitPrice);

  await prisma.order.create({
    data: {
      businessId: user.businessId,
      customerId,
      orderNo,
      status,
      total,
      lastContactAt: null,
      items: {
        create: [{ name: itemName, qty: Math.max(1, qty), unitPrice: Math.max(0, unitPrice) }],
      },
    },
  });

  redirect("/app/orders");
}

export async function touchLastContactAction(orderId: string) {
  const user = await requireUser();
  if (!user) redirect("/login");

  await prisma.order.updateMany({
    where: { id: orderId, businessId: user.businessId },
    data: { lastContactAt: new Date() },
  });

  redirect("/app/orders");
}
