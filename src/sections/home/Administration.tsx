"use client";

import { useEffect, useRef, useState } from "react";
import { Montserrat, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/buttonCustom";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

gsap.registerPlugin(ScrollTrigger);

type tab = "persyaratan" | "jadwal";

interface tab_content {
  title: string;
  img: string;
  content: string[];
}

const tab_content: Record<tab, tab_content> = {
  persyaratan: {
    title: "Persyaratan Pendaftaran Santri Baru",
    img: "/assets/icon/reqruitment.png",
    content: [
      "Lulus Sekolah Menengah Pertama",
      "Memiliki hafalan Al-Quran minimal 5 juz",
      "Memiliki kemauan sendiri bukan karena paksaan",
      "Upload dokumen yang diperlukan",
    ],
  },
  jadwal: {
    title: "Jadwal Pendaftaran Santri Baru",
    img: "/assets/icon/time.png",
    content: [
      "Pendaftaran dibuka : 9 September 2025",
      "Pendaftaran ditutup : 1 Maret 2026 atau kuota telah terpenuhi",
    ],
  },
};

export default function Administration({ id }: { id: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<tab>("persyaratan");

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

      // Card and content initial animation
      gsap.fromTo(
        [cardRef.current, controlRef.current],
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Tab change animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate out current content
      gsap.to([cardRef.current, contentRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          // Animate in new content
          gsap.fromTo(
            [cardRef.current, contentRef.current],
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.1,
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <>
      <section
        id={id}
        ref={sectionRef}
        className={`min-h-screen py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30 ${montserrat.className}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              ref={titleRef}
              className={`${spaceGrotesk.className} text-4xl lg:text-6xl font-bold text-gray-900 mb-6`}
            >
              Catat Jadwal dan
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">
                Persyaratannya!
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lengkapi syarat, catat jadwal, dan mulai perjalanan sekolah seru bersama kami!
            </p>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div ref={cardRef} className="card">
              <CardAdminstrasi image={tab_content[activeTab].img} />
            </div>
            <div className="content">
              <div
                ref={controlRef}
                className="control w-full flex gap-3 lg:gap-5"
              >
                {(["persyaratan", "jadwal"] as tab[]).map((item) => (
                  <BtnControl
                    key={item}
                    text={item === "persyaratan" ? "Persyaratan" : "Jadwal"}
                    onClick={() => setActiveTab(item)}
                    isActive={activeTab === item}
                  />
                ))}
              </div>
              <div ref={contentRef}>
                <ContentCard
                  title={tab_content[activeTab].title}
                  content={tab_content[activeTab].content}
                />
              </div>
              <Button
                size="lg"
                isGradient={false}
                text="Download brosur pendaftaran"
                onClick={() => console.log("Daftar Sekarang")}
                className="mt-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface btn_props {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
}

function BtnControl({ text, onClick, isActive }: btn_props) {
  const btnRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    // Button click animation
    gsap.to(btnRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    if (onClick) onClick();
  };

  return (
    <div
      ref={btnRef}
      onClick={handleClick}
      className={`${
        montserrat.className
      } py-5 px-3 rounded-md font-bold flex flex-1/2 justify-center items-center hover:cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
          : "bg-gradient-to-r from-white to-white text-slate-700 border-2 border-slate-700 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      <p>{text}</p>
    </div>
  );
}

const ContentCard = ({
  title,
  content,
}: {
  title: string;
  content: string[];
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate list items
      gsap.fromTo(
        listRef.current?.children || [],
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.2,
        }
      );
    }, listRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <h3
        className={`${spaceGrotesk.className} text-3xl md:text-4xl lg:text-5xl text-slate-700 font-bold mb-4`}
      >
        {title}
      </h3>
      <ul
        ref={listRef}
        className="list-disc list-inside text-base lg:text-lg text-slate-700"
      >
        {content.map((item, index) => (
          <li
            key={index}
            className="mb-2 transform transition-all duration-300 hover:translate-x-2 hover:text-blue-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CardAdminstrasi = ({
  image,
  className,
}: {
  image: string;
  className?: string;
}) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image entrance animation
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );

      // Floating animation
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, imageRef);

    return () => ctx.revert();
  }, [image]);

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div
          ref={imageRef}
          className="transform transition-all duration-300 hover:scale-105"
        >
          <Image
            src={image}
            alt="Administration illustration"
            width={500}
            height={500}
            className={`object-cover ${className}`}
            priority
          />
        </div>
      </div>
    </>
  );
};
