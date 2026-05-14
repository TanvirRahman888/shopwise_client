"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShoppingCart, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PublicLayout } from "@/components/layout/public-layout";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectByRole = (role: string) => {
    if (role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    if (role === "manager") {
      router.push("/dashboard/manager");
      return;
    }

    router.push("/dashboard");
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setServerError("");

      const data = await loginUser(values);

      setAuth(data.user, data.token);
      redirectByRole(data.user.role);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      setServerError("");

      const demoCredentials = {
        email: "admin@shopwise.com",
        password: "123456",
      };

      setValue("email", demoCredentials.email);
      setValue("password", demoCredentials.password);

      const data = await loginUser(demoCredentials);

      setAuth(data.user, data.token);
      redirectByRole(data.user.role);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Demo login failed. Make sure the demo admin account exists."
      );
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <PublicLayout>
      <main className="bg-white py-16 dark:bg-slate-950">
        <Container>
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
            <section className="relative hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-950 p-10 text-white lg:block">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white blur-3xl" />
                <div className="absolute bottom-16 right-10 h-40 w-40 rounded-full bg-violet-400 blur-3xl" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                    <ShoppingCart className="h-7 w-7" />
                  </div>

                  <h1 className="mt-8 text-4xl font-black leading-tight">
                    Welcome back to ShopWise
                  </h1>

                  <p className="mt-5 max-w-md text-lg leading-8 text-emerald-50">
                    Login to manage orders, view recommendations, apply coupons,
                    and continue shopping smarter.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-emerald-50">
                    Demo Admin
                  </p>
                  <p className="mt-2 text-2xl font-black">admin@shopwise.com</p>
                  <p className="mt-1 text-sm text-emerald-50">
                    Use the demo button to test admin dashboard access.
                  </p>
                </div>
              </div>
            </section>

            <section className="p-6 sm:p-10">
              <div className="mx-auto max-w-md">
                <div className="mb-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600 text-white">
                    <UserRound className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                    Login to your account
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Access your dashboard and continue shopping.
                  </p>
                </div>

                {serverError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 rounded-full pl-11"
                        {...register("email")}
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-2 text-sm font-semibold text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-full pl-11 pr-12"
                        {...register("password")}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-2 text-sm font-semibold text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-full bg-emerald-600 text-base font-bold hover:bg-emerald-700"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isDemoLoading}
                    onClick={handleDemoLogin}
                    className="h-12 w-full rounded-full text-base font-bold"
                  >
                    {isDemoLoading ? "Logging in..." : "Demo Admin Login"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>
    </PublicLayout>
  );
}