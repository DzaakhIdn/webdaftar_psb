"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import {
  Sparkle,
  Smile,
  Brain,
  BookOpen,
  Earth,
  Code,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

gsap.registerPlugin(ScrollTrigger);

const bentoItems = [
  {
    id: 1,
    title: "Saling Melengkapi",
    description: " Terintegrasi antara Tahfidz, Diniyyah, Bahasa, & IT",
    icon: Sparkle,
    image: "/assets/bento-card/img-1.jpg",
    className: "col-span-2 row-span-2",
  },
  {
    id: 2,
    title: "Adab Dahulu Baru Ilmu",
    description: "Sistem boarding yang menanamkan adab dan kedisiplinan",
    icon: Smile,
    image: "/assets/bento-card/img-2.jpg",
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Pengajar Profesional",
    description: "Pembelajaran aktif & teacher berpengalaman",
    icon: Brain,
    image: "/assets/bento-card/img-3.jpg",
    className: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "Target hafalan minimal 10 juz",
    description: "Target hafalan agar hafalan tetap terjaga",
    icon: BookOpen,
    image: "/assets/bento-card/img-4.jpg",
    className: "col-span-1 row-span-2",
  },
  {
    id: 5,
    title: "Language Immersion",
    description: " Kelas Bahasa Arab & Inggris aktif",
    icon: Earth,
    image: "/assets/bento-card/img-5.jpg",
    className: "col-span-2 row-span-1",
  },
  {
    id: 6,
    title: "Pembekalan Digital",
    description: "Pembekalan literasi digital & pemrograman dasar",
    icon: Code,
    image: "/assets/bento-card/img-6.jpg",
    className: "col-span-1 row-span-1",
  },
];

export default function Selling({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Cards stagger animation
      gsap.fromTo(
        ".bento-card",
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Hover animations for each card
      document.querySelectorAll(".bento-card").forEach((card) => {
        const image = card.querySelector(".card-image");
        const content = card.querySelector(".card-content");
        const icon = card.querySelector(".card-icon");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(image, {
            scale: 1.1,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(content, {
            y: -5,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(image, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(content, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(icon, {
            rotate: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className={`${spaceGrotesk.className} text-4xl lg:text-6xl font-bold text-gray-900 mb-6`}
          >
            Mengapa Memilih
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
              Sekolah Kami?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan keunggulan yang membuat kami berbeda dan menjadi pilihan
            terbaik untuk masa depan pendidikan anak Anda
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {bentoItems.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className="bento-card group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
              >
                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Scanning Line Effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>

                {/* Image Container */}
                <div className="card-image relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 filter group-hover:brightness-110"
                  />
                  
                  {/* Tech Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent group-hover:from-blue-900/40 transition-all duration-500"></div>
                  
                  {/* Holographic Corner */}
                  <div className="absolute top-4 right-4 w-12 h-12 border border-white/30 rounded-lg backdrop-blur-md bg-white/10 flex items-center justify-center group-hover:border-blue-400/50 group-hover:bg-blue-500/20 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Tech Corner Brackets */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="card-content relative p-6 bg-gradient-to-b from-white to-gray-50/50">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">ACTIVE</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Tech Progress Bar */}
                  <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                  </div>

                  {/* Data Points */}
                  <div className="flex justify-between items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-mono text-gray-400">SYS_OK</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono text-gray-400">v2.{index + 1}.0</span>
                    </div>
                  </div>

                  {/* Side Tech Accent */}
                  <div className="absolute left-0 top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Holographic Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
                
                {/* Outer Tech Glow */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/10 blur-sm transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}





