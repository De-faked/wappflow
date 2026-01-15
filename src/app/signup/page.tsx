import { signupAction } from "@/app/(auth)/actions";

export default function SignupPage() {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-gray-600 mt-1">
          WhatsApp-first order and payment control.
        </p>

        <form action={signupAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Business name</label>
            <input
              name="businessName"
              required
              className="mt-2 w-full rounded-lg border px-3 py-2"
              placeholder="e.g., Abdulrahman Oud Shop"
            />
          </div>

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
              placeholder="Minimum 8 characters"
            />
          </div>

          <button className="w-full rounded-lg bg-black text-white py-2">
            Create account
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a className="underline" href="/login">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
