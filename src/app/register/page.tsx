"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { PublicLayout } from "@/components/layout/public-layout";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setServerError("");

      const data = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: "user",
      });

      setAuth(data.user, data.token);
      redirectByRole(data.user.role);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <PublicLayout>
      <main className="bg-white py-16 dark:bg-slate-950">
        <Container>
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
            <section className="relative hidden bg-gradient-to-br from-slate-950 via-emerald-800 to-emerald-600 p-10 text-white lg:block">
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
                    Create your ShopWise account
                  </h1>

                  <p className="mt-5 max-w-md text-lg leading-8 text-emerald-50">
                    Join ShopWise to discover smart deals, save favorite
                    products, manage orders, and get personalized shopping
                    recommendations.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-emerald-50">
                    Smart ecommerce experience
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    Products, coupons, orders, and AI features in one platform.
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
                    Create an account
                  </h2>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Register as a customer and start shopping.
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
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="h-12 rounded-full pl-11"
                        {...register("name")}
                      />
                    </div>

                    {errors.name && (
                      <p className="mt-2 text-sm font-semibold text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

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
                        placeholder="Create a password"
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

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="h-12 rounded-full pl-11 pr-12"
                        {...register("confirmPassword")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm font-semibold text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-full bg-emerald-600 text-base font-bold hover:bg-emerald-700"
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Login
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