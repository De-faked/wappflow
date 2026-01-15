import { prisma } from "@/lib/db";

export async function nextOrderNo(businessId: string): Promise<number> {
  const seq = await prisma.sequence.update({
    where: { businessId_key: { businessId, key: "orderNo" } },
    data: { nextVal: { increment: 1 } },
    select: { nextVal: true },
  });

  // seq.nextVal is AFTER increment; so actual assigned number is nextVal - 1
  return seq.nextVal - 1;
}
