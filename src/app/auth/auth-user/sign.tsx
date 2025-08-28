"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GraduationCap,
  Star,
  Shield,
  Users,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Trophy,
  Heart,
  Zap,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Montserrat, Space_Grotesk } from "next/font/google";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const formSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    fullname: z.string().min(3, "Nama minimal 3 karakter"),
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter"),
    jalur: z.string().min(1, "Pilih jalur pendaftaran"),
    gender: z.string().min(1, "Pilih jenis kelamin"),
    walsanId: z.string().min(1, "Masukan Id yang sudah di berikan"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(formRef.current, { opacity: 0, y: 50 });
      gsap.set(rightPanelRef.current, { opacity: 0, x: 100 });
      gsap.set(".form-field", { opacity: 0, y: 20 });
      gsap.set(".floating-element", { opacity: 0, scale: 0 });
      gsap.set(".particle", { opacity: 0, scale: 0 });

      // Enhanced entrance animation
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(rightPanelRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .to(
          ".floating-element",
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.8"
        )
        .to(
          ".particle",
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // Enhanced floating animations with different patterns
      gsap.to(".floating-element", {
        y: -15,
        rotation: 5,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.4,
      });

      // Particle floating animation
      gsap.to(".particle", {
        y: -20,
        x: 10,
        rotation: 360,
        duration: 4,
        ease: "none",
        repeat: -1,
        stagger: 0.5,
      });

      // Enhanced form field interactions
      document.querySelectorAll(".form-field").forEach((field) => {
        field.addEventListener("mouseenter", () => {
          gsap.to(field, {
            scale: 1.02,
            y: -2,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        field.addEventListener("mouseleave", () => {
          gsap.to(field, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Background gradient animation
      gsap.to(backgroundRef.current, {
        backgroundPosition: "200% 200%",
        duration: 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSignUp = () => {
    // Add transition animation
    gsap.to(".form-container", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setIsSignUp(!isSignUp);
        gsap.to(".form-container", {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.1,
        });
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 ${montserrat.className}`}
    >
      <div className="h-full grid lg:grid-cols-2 relative overflow-hidden">
        {/* Left Panel - Form */}
        <div className="flex items-center flex-col justify-center p-6 lg:p-12 relative z-10">
          {isSignUp ? <SignInPage /> : <SignUpPage />}

          <p className="text-center text-gray-600">
            {isSignUp ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              onClick={handleSignUp}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              {isSignUp ? "Daftar Sekarang" : "Masuk di sini"}
            </button>
          </p>
        </div>

        {/* Right Panel - Visual */}
        <div
          ref={rightPanelRef}
          className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden min-h-screen"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>

          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <div className="floating-element mb-8">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <GraduationCap className="w-12 h-12 text-yellow-400" />
              </div>
            </div>

            <h2 className={`text-4xl font-bold mb-6 ${spaceGrotesk.className}`}>
              Bergabung dengan 1000+ Santri
            </h2>

            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Raih prestasi gemilang dengan pendidikan berkualitas tinggi yang
              menggabungkan nilai-nilai Islam, akademik modern, dan teknologi
              terdepan.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="floating-element bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-blue-100 text-sm">Tingkat Kelulusan</div>
              </div>

              <div className="floating-element bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Users className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-blue-100 text-sm">Guru Berpengalaman</div>
              </div>
            </div>

            <div className="floating-element bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 inline-flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-sm">Lingkungan Aman & Terpantau 24/7</span>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="floating-element absolute top-20 right-20 w-6 h-6 bg-yellow-400/30 rounded-full"></div>
          <div className="floating-element absolute bottom-32 left-16 w-4 h-4 bg-blue-400/40 rounded-full"></div>
          <div className="floating-element absolute top-1/3 left-12 w-8 h-8 bg-purple-400/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

const SignUpPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
      jalur: "",
      gender: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Button click animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
    console.log(data);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(formRef.current, { opacity: 0, y: 50 });
      gsap.set(".form-field", { opacity: 0, y: 20 });
      gsap.set(".floating-element", { opacity: 0, scale: 0 });

      // Main animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          ".form-field",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          ".floating-element",
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );

      // Floating animations
      gsap.to(".floating-element", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Form field hover animations
      document.querySelectorAll(".form-field").forEach((field) => {
        field.addEventListener("mouseenter", () => {
          gsap.to(field, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        field.addEventListener("mouseleave", () => {
          gsap.to(field, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <>
      <div
        ref={containerRef}
        className="flex items-center justify-center p-6 lg:p-12 relative z-10"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="floating-element inline-block p-3 bg-blue-100 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>

            <p
              ref={titleRef}
              className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 tracking-tight leading-tight ${spaceGrotesk.className}`}
            >
              Mulai Perjalanan Hebat Anak Anda
            </p>

            <p ref={subtitleRef} className="text-gray-600 leading-relaxed">
              Bergabunglah dengan HSI Boarding School untuk pendidikan Qurani,
              bahasa, dan teknologi yang terintegrasi
            </p>
          </div>

          {/* Form */}
          <div ref={formRef}>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Minimal 8 karakter"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Konfirmasi Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ulangi password"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="submit-btn w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:cursor-pointer"
                >
                  Daftar Sekarang
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

const SignInPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      walsanId: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Button click animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
    console.log(data);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(formRef.current, { opacity: 0, y: 50 });
      gsap.set(".form-field", { opacity: 0, y: 20 });
      gsap.set(".floating-element", { opacity: 0, scale: 0 });

      // Main animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          ".form-field",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          ".floating-element",
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );

      // Floating animations
      gsap.to(".floating-element", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Form field hover animations
      document.querySelectorAll(".form-field").forEach((field) => {
        field.addEventListener("mouseenter", () => {
          gsap.to(field, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        field.addEventListener("mouseleave", () => {
          gsap.to(field, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <>
      <div
        ref={containerRef}
        className="flex items-center justify-center p-6 lg:p-12 relative z-10"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="floating-element inline-block p-3 bg-blue-100 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>

            <p
              ref={titleRef}
              className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 tracking-tight leading-tight ${spaceGrotesk.className}`}
            >
              Selamat Datang Kembali, Wali Santri
            </p>

            <p ref={subtitleRef} className="text-gray-600 leading-relaxed">
              Masuk ke akun Anda untuk melanjutkan proses pendaftaran, melihat
              status seleksi, atau melengkapi dokumen santri.
            </p>
          </div>

          {/* Form */}
          <div ref={formRef}>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="walsanId"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Walsan ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Masukkan nama lengkap"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="form-field">
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Minimal 8 karakter"
                          className="h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="submit-btn w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:cursor-pointer"
                >
                  Masuk
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
