import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <main className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">
            404 Error
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl dark:text-white">
            Page not found
          </h1>

          <p className="mt-5 text-slate-600 dark:text-slate-400">
            The page you are looking for does not exist or may have been moved.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild className="rounded-full bg-emerald-600 px-6 hover:bg-emerald-700">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}