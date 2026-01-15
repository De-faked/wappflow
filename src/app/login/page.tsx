import { loginAction } from "@/app/(auth)/actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-gray-600 mt-1">
          Continue to your WhatsApp operations dashboard.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="Your password"
            />
          </div>

          <button className="w-full rounded-lg bg-black text-white py-2">
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          New here?{" "}
          <a className="underline" href="/signup">
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}
