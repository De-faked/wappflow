import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">WAppFlow</div>
            <div className="text-xs text-gray-600">{user.business.name}</div>
          </div>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="underline" href="/app">Dashboard</Link>
            <Link className="underline" href="/app/customers">Customers</Link>
            <Link className="underline" href="/app/orders">Orders</Link>
            <form action={logoutAction}>
              <button className="rounded-lg border px-3 py-1.5">Logout</button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
