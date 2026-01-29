"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { nextOrderNo } from "@/lib/sequence";
import { CreateCustomerSchema, CreateOrderSchema } from "@/lib/validation";

function requireUser() {
  return getCurrentUser();
}



export async function createCustomerAction(_prevState: any, formData: FormData) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = CreateCustomerSchema.safeParse({
    name: formData.get("name"),
    phoneE164: formData.get("phoneE164"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { name, phoneE164, notes } = parsed.data;

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

export async function createOrderAction(_prevState: any, formData: FormData) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const parsed = CreateOrderSchema.safeParse({
    customerId: formData.get("customerId"),
    status: formData.get("status"),
    itemName: formData.get("itemName"),
    qty: formData.get("qty"),
    unitPrice: formData.get("unitPrice"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { customerId, status, itemName, qty, unitPrice } = parsed.data;

  const orderNo = await nextOrderNo(user.businessId);
  const total = qty * unitPrice;

  await prisma.order.create({
    data: {
      businessId: user.businessId,
      customerId,
      orderNo,
      status,
      total,
      lastContactAt: null,
      items: {
        create: [{ name: itemName, qty, unitPrice }],
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
