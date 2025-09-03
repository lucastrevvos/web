export function SiteHeader() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <a href="/" className="text-lg font-bold tracking-tight">
          Trevvos
        </a>
        <nav className="space-x-3 text-sm">
          <a href="/login">Entrar</a>
          <a
            href="/new-post"
            className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
          >
            Novo Post
          </a>
        </nav>
      </div>
    </header>
  );
}
