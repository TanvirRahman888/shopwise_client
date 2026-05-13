export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            ShopWise
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl dark:text-white">
            Frontend setup is working
          </h1>

          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
            Next.js, Tailwind, ShadCN, Axios, TanStack Query, and theme provider are ready.
          </p>
        </div>
      </section>
    </main>
  );
}