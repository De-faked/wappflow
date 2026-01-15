export default function Home() {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border p-6">
        <h1 className="text-3xl font-semibold">WAppFlow</h1>
        <p className="text-gray-600 mt-2">
          WhatsApp-first order, payment, and follow-up control for micro-businesses.
        </p>

        <div className="mt-6 flex gap-3">
          <a className="rounded-lg bg-black text-white px-4 py-2" href="/signup">
            Create account
          </a>
          <a className="rounded-lg border px-4 py-2" href="/login">
            Login
          </a>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          This product is designed around one thing: never lose an order inside WhatsApp again.
        </p>
      </div>
    </main>
  );
}
