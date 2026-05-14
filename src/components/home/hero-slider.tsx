"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider, SlidersResponse } from "@/types/slider";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function HeroSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const activeSlider = sliders.length > 0 ? sliders[activeIndex] : null;

  useEffect(() => {
    let isMounted = true;

    async function loadSliders() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/sliders/active`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch sliders");
        }

        const data: SlidersResponse = await res.json();

        if (isMounted) {
          setSliders(data.sliders || []);
          setActiveIndex(0);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSliders();

    return () => {
      isMounted = false;
    };
  }, []);

  const goNext = () => {
    if (!sliders.length) return;
    setActiveIndex((prev) => (prev + 1) % sliders.length);
  };

  const goPrev = () => {
    if (!sliders.length) return;
    setActiveIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  useEffect(() => {
    if (sliders.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [sliders.length]);

  if (isLoading) {
    return (
      <section className="bg-linear-to-br from-emerald-50 via-white to-violet-50 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <Container>
          <Skeleton className="h-90 rounded-4xl md:h-110" />
        </Container>
      </section>
    );
  }

  if (error || !activeSlider) {
    return (
      <section className="bg-linear-to-br from-emerald-50 via-white to-violet-50 py-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <Container>
          <div className="rounded-4xl border border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p className="font-bold">Failed to load sliders.</p>
            <p className="mt-2 text-sm">
              {error || "Make sure sliders are active in the backend."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-linear-to-br from-emerald-50 via-white to-violet-50 py-8 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Container>
        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl shadow-emerald-100/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="grid min-h-105 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-14">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Smart Shopping Deal
              </div>

              {activeSlider.offerText && (
                <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-orange-500">
                  {activeSlider.offerText}
                </p>
              )}

              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl dark:text-white">
                {activeSlider.title}
              </h1>

              {activeSlider.subtitle && (
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
                  {activeSlider.subtitle}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-emerald-600 px-7 text-base font-bold hover:bg-emerald-700"
                >
                  <Link href={activeSlider.link}>{activeSlider.buttonText}</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full px-7 text-base font-bold"
                >
                  <Link href="/products">Explore Products</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-h-70 lg:min-h-full">
              <Image
                src={activeSlider.mobileImage || activeSlider.image}
                alt={activeSlider.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent lg:bg-linear-to-r lg:from-white lg:via-white/20 lg:to-transparent dark:lg:from-slate-900" />

              <div className="absolute bottom-6 right-6 rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur dark:bg-slate-950/90">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Featured Offer
                </p>
                <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                  {activeSlider.offerText || "Special Deal"}
                </p>
              </div>
            </div>
          </div>

          {sliders.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-emerald-600 hover:text-white md:flex dark:bg-slate-950/90 dark:text-slate-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-emerald-600 hover:text-white md:flex dark:bg-slate-950/90 dark:text-slate-200"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {sliders.map((slider, index) => (
                  <button
                    key={slider._id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === index
                        ? "w-8 bg-emerald-600"
                        : "w-2.5 bg-white/80 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}