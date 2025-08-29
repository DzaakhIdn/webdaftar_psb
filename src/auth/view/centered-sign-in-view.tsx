"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { useAuth } from "@/auth/hooks/use-auth";
import { useToast } from "@/components/providers/toast-provider";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { api, paths } from "@/routes/paths";

const SignInSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export function SignInView() {
  const { login } = useAuth({ loginEndpoint: api.dashboard.login });
  const { showSuccess, showError } = useToast();
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const fieldsRef = useRef<HTMLDivElement[]>([]);
  const buttonRef = useRef(null);
  const linkRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // Enhanced entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set(
      [
        containerRef.current,
        titleRef.current,
        ...fieldsRef.current,
        buttonRef.current,
        linkRef.current,
      ],
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      }
    );

    gsap.set(".floating-element", { scale: 0, opacity: 0 });

    tl.to(".floating-element", {
      scale: 1,
      opacity: 1,
      duration: 2,
      ease: "power2.out",
      stagger: 0.3,
    })
      .to(
        containerRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=1.5"
      )
      .to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.4"
      )
      .to(
        fieldsRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
        },
        "-=0.3"
      )
      .to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
        },
        "-=0.2"
      )
      .to(
        linkRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
        },
        "-=0.2"
      );

    gsap.to(".floating-element", {
      y: "random(-10, 10)",
      x: "random(-5, 5)",
      rotation: "random(-2, 2)",
      duration: "random(3, 5)",
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5,
    });
  }, []);

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);

    // Enhanced button press animation
    gsap.to(buttonRef.current, {
      scale: 0.96,
      duration: 0.15,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    try {
      await login(data.username, data.password, "admin", "dashboard", paths.dashboard.root);

      // Show success message
      showSuccess("Login berhasil! Mengarahkan ke dashboard...");

      // Success animation
      gsap.to(containerRef.current, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    } catch (error) {
      // Show error message
      showError("Periksa username dan password Anda.");

      // Enhanced error shake animation
      gsap.to(containerRef.current, {
        x: -8,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 5,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(30 58 138) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating Geometric Elements */}
      <div className="floating-element absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-200/30 rounded-full blur-2xl" />
      <div className="floating-element absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-violet-100/30 to-purple-200/30 rounded-full blur-2xl" />
      <div className="floating-element absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-emerald-100/30 to-teal-200/30 rounded-full blur-2xl" />

      {/* Additional decorative elements */}
      <div className="floating-element absolute top-1/3 right-16 w-20 h-20 bg-gradient-to-br from-rose-100/25 to-pink-200/25 rounded-full blur-xl" />
      <div className="floating-element absolute bottom-1/3 left-16 w-28 h-28 bg-gradient-to-br from-amber-100/25 to-orange-200/25 rounded-full blur-xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(30, 58, 138, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30, 58, 138, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-70" />

        <Card
          ref={containerRef}
          className="backdrop-blur-md bg-white/90 border border-white/20 shadow-2xl shadow-slate-900/10 rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-slate-50/30 rounded-3xl" />

          <CardHeader
            className="space-y-4 pb-6 pt-12 px-10 relative z-10"
            ref={titleRef}
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                  <LogIn size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur-lg opacity-30 -z-10" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extralight text-center text-blue-900 tracking-wide leading-tight">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-center text-blue-600/70 font-light leading-relaxed text-base max-w-sm mx-auto">
              Masuk ke dashboard admin dengan kredensial Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10 relative z-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div
                  ref={(el) => {
                    if (el) fieldsRef.current[0] = el;
                  }}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-800">
                          Username
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="admin"
                              className="h-14 bg-blue-50/30 border-blue-200/60 rounded-2xl focus:bg-white focus:border-blue-400 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300 text-blue-900 placeholder:text-blue-400 pl-4 font-light"
                              {...field}
                            />
                            {/* Input focus glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/0 via-blue-200/20 to-blue-200/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div
                  ref={(el) => {
                    if (el) fieldsRef.current[1] = el;
                  }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-blue-800">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-14 bg-blue-50/30 border-blue-200/60 rounded-2xl focus:bg-white focus:border-blue-400 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300 text-blue-900 placeholder:text-blue-400 pr-14 pl-4 font-light"
                              {...field}
                            />
                            {/* Input focus glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/0 via-blue-200/20 to-blue-200/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-all duration-200 p-2 rounded-lg hover:bg-blue-100/50"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    ref={buttonRef}
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-light rounded-2xl shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-400 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {isLoading ? (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span className="font-light text-lg">Memproses...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 relative z-10">
                        <LogIn size={20} />
                        <span className="font-light text-lg">
                          Masuk ke Dashboard
                        </span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-blue-200/60" />
                  </div>
                </div>

                <div ref={linkRef} className="text-center">
                  <span className="text-blue-600/70 text-sm font-light">
                    Belum memiliki akun?{" "}
                  </span>
                  <Link
                    href="/auth/auth-dashboard/sign-up"
                    className="text-sm font-medium text-blue-700 hover:text-blue-900 underline-offset-4 hover:underline transition-all duration-200 relative group"
                  >
                    <span className="relative z-10">Daftar sekarang</span>
                    <div className="absolute inset-0 bg-blue-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10" />
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
