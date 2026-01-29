import { prisma } from "./db";
import { headers } from "next/headers";

export async function checkRateLimit(action: string, limit = 5, windowSeconds = 60) {
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowSeconds * 1000);

    // Clean up old entries (optional optimization)
    // await prisma.rateLimit.deleteMany({ where: { expiresAt: { lt: now } } });

    const record = await prisma.rateLimit.findUnique({
        where: { ip_action: { ip, action } },
    });

    if (record) {
        if (record.expiresAt < now) {
            // Window expired, reset
            await prisma.rateLimit.update({
                where: { id: record.id },
                data: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) },
            });
            return true;
        }

        if (record.count >= limit) {
            return false;
        }

        await prisma.rateLimit.update({
            where: { id: record.id },
            data: { count: { increment: 1 } },
        });
        return true;
    } else {
        await prisma.rateLimit.create({
            data: {
                ip,
                action,
                count: 1,
                expiresAt: new Date(now.getTime() + windowSeconds * 1000),
            },
        });
        return true;
    }
}
