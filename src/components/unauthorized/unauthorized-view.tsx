"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Shield, ArrowLeft, Home, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ButtonCustom from "@/components/ui/buttonCustom";

interface UnauthorizedViewProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  customActions?: React.ReactNode;
}

export function UnauthorizedView({
  title = "Akses Ditolak",
  description = "Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.",
  showBackButton = true,
  showHomeButton = true,
  customActions,
}: UnauthorizedViewProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([cardRef.current, iconRef.current, titleRef.current, descriptionRef.current, buttonsRef.current, alertRef.current], {
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      gsap.set(".floating-element", {
        opacity: 0,
        scale: 0,
        rotation: 0,
      });

      gsap.set(".particle", {
        opacity: 0,
        scale: 0,
      });

      // Main animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Floating elements entrance
      tl.to(".floating-element", {
        opacity: 0.4,
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
        stagger: 0.15,
      })
      // Particles entrance
      .to(".particle", {
        opacity: 0.8,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
      }, "-=1.2")
      // Card entrance with dramatic effect
      .to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.8")
      // Icon entrance with spin
      .to(iconRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 360,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5")
      // Title entrance with typewriter effect
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.3")
      // Alert box entrance
      .to(alertRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2")
      // Description entrance
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2")
      // Buttons entrance
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }, "-=0.1");

      // Continuous animations
      gsap.to(".floating-element", {
        y: "random(-25, 25)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(5, 8)",
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.4,
      });

      gsap.to(".particle", {
        y: "random(-10, 10)",
        x: "random(-10, 10)",
        rotation: "random(-180, 180)",
        duration: "random(3, 5)",
        ease: "none",
        repeat: -1,
        stagger: 0.2,
      });

      // Icon breathing animation
      gsap.to(iconRef.current, {
        scale: 1.15,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Interactive animations
      const buttons = buttonsRef.current?.querySelectorAll('button');
      buttons?.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            y: -3,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Card hover effect
      cardRef.current?.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, {
          y: -8,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          duration: 0.4,
          ease: "power2.out",
        });
      });

      cardRef.current?.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, {
          y: 0,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.4,
          ease: "power2.out",
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating elements */}
        <div className="floating-element absolute top-20 left-20 w-20 h-20 bg-red-200 rounded-full opacity-30" />
        <div className="floating-element absolute top-40 right-32 w-16 h-16 bg-orange-200 rounded-full opacity-25" />
        <div className="floating-element absolute bottom-32 left-40 w-24 h-24 bg-pink-200 rounded-full opacity-20" />
        <div className="floating-element absolute bottom-20 right-20 w-18 h-18 bg-red-300 rounded-full opacity-35" />
        <div className="floating-element absolute top-1/2 left-10 w-12 h-12 bg-orange-300 rounded-full opacity-40" />
        <div className="floating-element absolute top-1/3 right-10 w-14 h-14 bg-pink-300 rounded-full opacity-30" />
        
        {/* Small particles */}
        <div className="particle absolute top-1/4 left-1/4 w-3 h-3 bg-red-400 rounded-full" />
        <div className="particle absolute top-3/4 right-1/4 w-2 h-2 bg-orange-400 rounded-full" />
        <div className="particle absolute bottom-1/4 left-3/4 w-4 h-4 bg-pink-400 rounded-full" />
        <div className="particle absolute top-1/2 right-1/3 w-2 h-2 bg-red-500 rounded-full" />
        <div className="particle absolute bottom-1/3 left-1/2 w-3 h-3 bg-orange-500 rounded-full" />
      </div>

      {/* Main Content */}
      <Card 
        ref={cardRef}
        className="w-full max-w-lg mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-md"
      >
        <CardHeader className="text-center pb-4">
          {/* Icon */}
          <div 
            ref={iconRef}
            className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full flex items-center justify-center shadow-xl relative"
          >
            <Shield className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse opacity-50" />
          </div>
          
          {/* Title */}
          <CardTitle 
            ref={titleRef}
            className="text-4xl font-bold text-gray-800 mb-3"
          >
            {title}
          </CardTitle>
          
          {/* Description */}
          <CardDescription 
            ref={descriptionRef}
            className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto"
          >
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Alert Box */}
          <div 
            ref={alertRef}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-5 mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400" />
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              </div>
              <div>
                <h4 className="text-red-800 font-semibold text-sm mb-1">Akses Terbatas</h4>
                <p className="text-red-700 text-sm leading-relaxed">
                  Halaman ini memerlukan tingkat akses yang lebih tinggi. Pastikan Anda login dengan akun yang memiliki izin yang sesuai.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            ref={buttonsRef}
            className="flex flex-col gap-4"
          >
            {showBackButton && (
              <ButtonCustom
                text="Kembali ke Halaman Sebelumnya"
                size="md"
                isGradient={false}
                onClick={handleGoBack}
                className="w-full justify-center"
              />
            )}
            
            {showHomeButton && (
              <ButtonCustom
                text="Kembali ke Beranda"
                size="md"
                isGradient={true}
                onClick={handleGoHome}
                className="w-full justify-center"
              />
            )}

            {customActions}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 leading-relaxed">
              Butuh bantuan? Hubungi administrator sistem<br />
              <span className="text-xs text-gray-400">Error Code: 403 - Forbidden</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
