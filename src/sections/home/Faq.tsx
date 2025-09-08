"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Space_Grotesk, Montserrat } from "next/font/google";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

gsap.registerPlugin(ScrollTrigger);

const faq = [
  {
    question: "Berapa biaya pendaftaran dan SPP per bulan di HSI Boarding School?",
    answer:
      "Biaya pendaftaran sebesar Rp 700.000. Untuk SPP, jalur reguler Rp 2.000.000/bulan sudah termasuk makan, asrama, dan fasilitas yang memadai.",
  },
  {
    question: "Apa saja persyaratan untuk mendaftar sebagai santri baru?",
    answer:
      "Semua persyaratan sudah tercantum diatas",
  },
  {
    question: "Bagaimana sistem pembelajaran dan kurikulum di HSI Boarding School?",
    answer:
      "Kami menggabungkan kurikulum nasional dengan kurikulum pesantren. Pembelajaran meliputi tahfidz Al-Qur'an, bahasa Arab & Inggris,diniyyah, teknologi, dan keterampilan hidup. Beberapa program diniyyah dilaksanakan dalam sistem mulazamah",
  },
  {
    question: "Apakah orang tua bisa mengunjungi anak selama di pesantren?",
    answer:
      "Wali santri boleh mengunjungi santri maksimal 1 bulan sekali namun tidak ada batasan khusus terkait waktu",
  },
  {
    question: "Di mana lokasi HSI Boarding School?",
    answer:
      "Kampus 1 (Sukabumi) : Kelas 11 & 12 Ikhwan, Kampus 2 (Purworejo) :  Kelas 10 Ikhwan, Kampus 3 (Bekasi) : Kelas 10 -12 Akhwat",
  },
  {
    question: "Bagaimana proses seleksi dan kapan pengumuman hasil diterima?",
    answer:
      "Proses seleksi meliputi: tes baca Al-Qur'an, tes tulis akademik, wawancara dengan calon santri dan orang tua, serta tes kesehatan. Pengumuman hasil seleksi diumumkan 7-14 hari kerja setelah tes melalui WhatsApp.",
  },
  {
    question: "Apakah ada program beasiswa dan bagaimana cara mendapatkannya?",
    answer:
      "Ya, tersedia beasiswa prestasi akademik, tahfidz, dan kurang mampu dengan potongan 25%-100%. Syarat: sesuai ketentuan di atas serta melampurkan surat keterangan tidak mampu, dan lulus tes seleksi khusus beasiswa.",
  },
];

const FAQ = ({ id }: { id: string }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

      // Subtitle animation
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

      // Accordion items animation
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Contact section animation
      gsap.fromTo(
        contactRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Floating animation for icons
      gsap.to(".floating-icon", {
        y: -8,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      // Hover animations for FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
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
      className={`min-h-screen py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 ${montserrat.className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="floating-icon inline-block p-4 bg-blue-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2
            ref={titleRef}
            className={`text-4xl md:text-6xl lg:text-7xl text-center !leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600 font-bold tracking-tight mb-6 ${spaceGrotesk.className}`}
          >
            Punya pertanyaan? <br />
            Temukan jawabannya!
          </h2>
          
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Pertanyaan yang sering ditanyakan seputar pendaftaran dan lingkungan di HSI Boarding School
          </p>
        </div>

        {/* FAQ Accordion */}
        <div ref={accordionRef} className="mb-16">
          <Accordion type="single" className="w-full space-y-4" defaultValue="question-0">
            {faq.map(({ question, answer }, index) => (
              <AccordionItem
                key={question}
                value={`question-${index}`}
                className="faq-item bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-lg font-semibold px-8 py-6 hover:no-underline hover:bg-blue-50/50 transition-colors duration-300">
                  <div className="flex items-start gap-4">
                    <div className="floating-icon p-2 bg-blue-100 rounded-lg mt-1">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-900 text-base lg:text-lg">{question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6">
                  <div className="pl-12">
                    <p className="text-gray-700 leading-relaxed text-base">{answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div
          ref={contactRef}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative z-10">
            <h3 className={`${spaceGrotesk.className} text-3xl lg:text-4xl font-bold mb-4`}>
              Punya pertanyaan lain?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Tim customer service kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami!
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="floating-icon bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-bold mb-2">Telepon</h4>
                <p className="text-blue-100">+62 895-2451-3151</p>
              </div>

              <div className="floating-icon bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <Mail className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-bold mb-2">Email</h4>
                <p className="text-blue-100">smait@hsi.id</p>
              </div>
            </div>

            <div className="mt-8">
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:cursor-pointer">
                <a href="https://wa.me/6289524513151">Hubungi Kami Sekarang</a>
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="floating-icon absolute top-8 right-8 w-6 h-6 bg-yellow-400/20 rounded-full"></div>
          <div className="floating-icon absolute bottom-8 left-8 w-4 h-4 bg-blue-400/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

