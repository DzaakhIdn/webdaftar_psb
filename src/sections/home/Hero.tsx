"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { Star } from "lucide-react";
import { Space_Grotesk, Gabarito, Montserrat } from "next/font/google";
import CountUp from "@/components/animate/count";
import Button from "@/components/ui/buttonCustom";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export function Hero({ id }: { id: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(imageRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(".floating-element", { opacity: 0, scale: 0 });

      // Main animation timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          ".floating-element",
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Floating animation
      gsap.to(".floating-element", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      // Parallax effect on scroll
      gsap.to(floatingRef.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={heroRef}
      className={`relative min-h-screen mt-32 lg:mt-0 flex items-center justify-center overflow-hidden ${montserrat.className}`}
    >
      {/* Floating background elements */}
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-40 left-20 w-24 h-24 bg-purple-200/25 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-20 right-10 w-16 h-16 bg-blue-300/30 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1
              ref={titleRef}
              className={`${spaceGrotesk.className} text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6`}
            >
              Pendaftaran Santri Baru
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                Telah Dibuka!
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className={`${gabarito.className} text-xl lg:text-2xl text-slate-700 mb-8 leading-relaxed max-w-2xl`}
            >
              Ingin anak Anda tumbuh menjadi penghafal Al-Qur’an yang cakap
              bahasa dan paham teknologi? Daftarkan sekarang ke HSI Boarding
              School.
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                isGradient
                text="Daftar Beasiswa"
                onClick={() => window.location.href = "/page/auth"}
              />

              <Button
                size="lg"
                text="Daftar Reguler"
                onClick={() => window.location.href = "/page/auth"}
                className={`hover:cursor-pointer`}
              />
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <CountUp to={1000} className={`${spaceGrotesk.className} text-3xl font-bold text-blue-400`} />
                <div className={`${montserrat.className} text-slate-700 text-base lg:text-lg`}>Siswa Aktif</div>
              </div>
              <div>
                <CountUp to={50} className={`${spaceGrotesk.className} text-3xl font-bold text-blue-500`} />
                <div className={`${montserrat.className} text-slate-700 text-base lg:text-lg`}>Guru Berpengalaman</div>
              </div>
              <div>
                <CountUp to={95} className={`${spaceGrotesk.className} text-3xl font-bold text-blue-600`} />
                <div className={`${montserrat.className} text-slate-700 text-base lg:text-lg`}>Tingkat Kelulusan</div>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div ref={imageRef} className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 z-10"></div>
              <Image
                src="/assets/header.jpg"
                alt="Students learning"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating cards */}
            <div className="floating-element absolute md:block hidden -top-6 lg:-right-6 md:-right-2 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Pendaftaran Dibuka
                </span>
              </div>
            </div>

            <div className="floating-element absolute md:block hidden -bottom-6 lg:-left-6 md:-left-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <p className={`${spaceGrotesk.className} text-xl font-bold text-blue-600`}>Ikhwan & Akhwat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
