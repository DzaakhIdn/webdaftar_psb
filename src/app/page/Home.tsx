/* eslint-disable @next/next/no-img-element */
import { Hero } from "@/sections/home/Hero";
import Selling from "@/sections/home/Selling";
import { Montserrat } from "next/font/google";
import { Flow } from "@/sections/home/Flow";
import Administration from "@/sections/home/Administration";
import Jalur from "@/sections/home/Jalur";
import Gallery from "@/sections/home/Gallery";
import FAQ from "@/sections/home/Faq";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const data = [
  {
    title: "Buat Akun",
    content: (
      <div>
        <p
          className={`mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200 ${montserrat.className}`}
        >
          Buat akun pendaftaran di website resmi HSI Boarding School
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/assets/registration/step-1-register.png"
            alt="Membuat akun pendaftaran"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/assets/registration/step-1-form.png"
            alt="Mengisi form pendaftaran"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Lengkapi Data",
    content: (
      <div className={`${montserrat.className}`}>
        <p
          className={`mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200`}
        >
          Lengkapi data pribadi calon santri dan upload dokumen yang diperlukan
        </p>
        <ul className="mb-8 list-disc">
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Akta kelahiran
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Kartu Keluarga
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Pas foto terbaru 3x4
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Surat keterangan sehat
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/assets/registration/step-2-documents.png"
            alt="Upload dokumen"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/assets/registration/step-2-data.png"
            alt="Mengisi data pribadi"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Pembayaran",
    content: (
      <div className={`${montserrat.className}`}>
        <p
          className={`mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200 `}
        >
          Lakukan pembayaran biaya pendaftaran dan ikuti tes seleksi
        </p>
        <ul className="mb-8 list-disc">
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Pembayaran biaya pendaftaran sebesar Rp 700.000
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Tes baca Al-Quran
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Tes tulis akademik
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Wawancara dengan orang tua
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Tes lainnya (jika dibutuhkan)
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/assets/registration/step-3-payment.png"
            alt="Pembayaran pendaftaran"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/assets/registration/step-3-test.png"
            alt="Tes seleksi"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Hasil Seleksi",
    content: (
      <div className={`${montserrat.className}`}>
        <p
          className={`mb-8 text-base font-normal text-neutral-800 md:text-lg dark:text-neutral-200 `}
        >
          Menunggu pengumuman hasil seleksi dan daftar ulang
        </p>
        <ul className="mb-8 list-disc">
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Pengumuman hasil seleksi dalam 7-14 hari kerja
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Notifikasi melalui WhatsApp
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Melakukan daftar ulang jika diterima
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Persiapan masuk asrama
          </li>
          <li className="text-base text-neutral-700 md:text-lg dark:text-neutral-300">
            Masa pengenalan lingkungan sekolah kepada santri baru
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/assets/registration/step-4-announcement.png"
            alt="Pengumuman hasil"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg bg-center object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
          <img
            src="/assets/registration/step-4-orientation.png"
            alt="Orientasi santri baru"
            width={500}
            height={500}
            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
          />
        </div>
      </div>
    ),
  },
];

export default function Home({ id }: { id: string[] }) {
  return (
    <div className={`${montserrat.className} overflow-hidden`}>
      <Hero id={id[0]} />
      <Selling id={id[1]} />
      <Flow data={data} id={id[2]} />
      <Administration id={id[3]} />
      <Jalur id={id[4]} />
      <Gallery id={id[5]} />
      <FAQ id={id[6]} />
    </div>
  );
}
