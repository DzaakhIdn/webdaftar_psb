
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk, Montserrat } from "next/font/google";
import { 
  GraduationCap, 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  Zap,
  Award,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react";
import Button from "@/components/ui/buttonCustom";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

gsap.registerPlugin(ScrollTrigger);

export default function Jalur({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const regularCardRef = useRef<HTMLDivElement>(null);
  const scholarshipCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animations
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards animations
      gsap.fromTo(
        regularCardRef.current,
        { opacity: 0, x: -100, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        scholarshipCardRef.current,
        { opacity: 0, x: 100, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Floating animations
      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      gsap.to(".scholarship-glow", {
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".pulse-ring", {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        repeat: -1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`min-h-screen py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 ${montserrat.className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className={`${spaceGrotesk.className} text-4xl lg:text-6xl font-bold text-gray-900 mb-6`}
          >
            Pilih Jalur
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
              Pendaftaran Anda
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Kami menyediakan dua jalur pendaftaran untuk memberikan kesempatan terbaik bagi setiap calon santri
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Regular Card */}
          <div
            ref={regularCardRef}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-blue-300/50 transform hover:-translate-y-2"
          >
            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
              <div className="absolute inset-0 rounded-3xl" style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="floating-icon p-3 bg-blue-100 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium">JALUR</div>
                  <div className="text-2xl font-bold text-gray-900">REGULER</div>
                </div>
              </div>

              <h3 className={`${spaceGrotesk.className} text-2xl font-bold text-gray-900 mb-4`}>
                Pendaftaran Reguler
              </h3>
              <p className="text-gray-600 mb-6">
                Jalur pendaftaran standar dengan biaya normal dan proses seleksi reguler
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Proses pendaftaran standar</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Biaya pendidikan normal</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Sarana dan Prasana KBM</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Bimbingan akademik</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">48</span>
                  </div>
                  <div className="text-sm text-gray-600">Kuota Tersedia</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">48</span>
                  </div>
                  <div className="text-sm text-gray-600">Kuota Tersisa</div>
                </div>
              </div>

              {/* Button */}
              <Button
                size="lg"
                text="Daftar Reguler"
                onClick={() => window.location.href = "/registant"}
                className="w-full"
              />
            </div>
          </div>

          {/* Scholarship Card */}
          <div
            ref={scholarshipCardRef}
            className="group relative bg-gradient-to-br from-blue-500 via-blue-700 to-blue-600 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
          >

            {/* Glow Effects */}
            <div className="scholarship-glow absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-3xl"></div>
            <div className="pulse-ring absolute top-4 right-4 w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="pulse-ring absolute top-4 right-4 w-4 h-4 bg-yellow-400 rounded-full"></div>

            {/* Tech Grid Pattern */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl">
              <div className="absolute inset-0 rounded-3xl" style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Header */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="floating-icon p-3 bg-yellow-400/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-200 font-medium">JALUR</div>
                  <div className="text-2xl font-bold text-white">BEASISWA</div>
                </div>
              </div>

              <h3 className={`${spaceGrotesk.className} text-2xl font-bold text-white mb-4`}>
                Pendaftaran Beasiswa
              </h3>
              <p className="text-blue-100 mb-6">
                Jalur khusus dengan bantuan biaya pendidikan untuk siswa berprestasi
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Potongan biaya pendidikan 100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Termasuk semua program reguler</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Masa intership 1 tahun</span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Peluang karir internasional</span>
                </div> */}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">48</span>
                  </div>
                  <div className="text-sm text-blue-200">Kuota Tersedia</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-white">48</span>
                  </div>
                  <div className="text-sm text-blue-200">Kuota Tersisa</div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => window.location.href = "/registant"}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Daftar Beasiswa Sekarang
              </button>

              {/* Urgency Text */}
              <div className="text-center mt-4">
                <div className="text-yellow-400 text-sm font-medium animate-pulse">
                  ⚡ Jangan sampai kehabisan!
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="floating-icon absolute top-20 right-8 w-6 h-6 bg-yellow-400/20 rounded-full"></div>
            <div className="floating-icon absolute bottom-20 left-8 w-4 h-4 bg-blue-400/30 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Masih bingung memilih jalur yang tepat?
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors duration-300">
            <a href="https://wa.me/6289524513151">Konsultasi dengan Tim Kami</a>
          </button>
        </div>
      </div>
    </section>
  );
}

