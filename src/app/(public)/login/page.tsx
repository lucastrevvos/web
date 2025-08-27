import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4">
      <div className="w-full rounded-lg border border-slate-200 p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">Entrar</h1>
        <form action={loginAction} className="grid gap-3">
          <input
            type="email"
            name="email"
            placeholder="e-mail"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <input
            name="password"
            type="password"
            placeholder="senha"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            className="mt-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
