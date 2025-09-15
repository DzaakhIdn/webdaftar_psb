"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/gallery_paralax";

export default function HeroParallaxDemo({ id }: { id: string }) {
  return <HeroParallax products={products} id={id} />;
}
export const products = [
  {
    title: "IT Learning",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-1.jpg",
  },
  {
    title: "Apel Pagi",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-2.jpg",
  },
  {
    title: "Kunjungan Panti Asuhan",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-3.jpg",
  },

  {
    title: "Panti Asuhan",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-4.jpg",
  },
  {
    title: "Morning Spirit",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-5.jpg",
  },
  {
    title: "Nusantara Spirit Day",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-6.jpg",
  },

  {
    title: "Eskul Futsal",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-7.jpg",
  },
  {
    title: "Kunjungan",
    link: "#",
    thumbnail:
      "/assets/gallery/ikh-8.jpg",
  },
  {
    title: "Eskul Panahan",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-1.jpg",
  },
  {
    title: "Pelajaran Kelas",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-2.jpg",
  },
  {
    title: "KBM Kelas",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-3.jpg",
  },

  {
    title: "Pelajaran",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-4.jpg",
  },
  {
    title: "Rihlah",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-5.jpg",
  },
  {
    title: "Halaqoh",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-6.jpg",
  },
  {
    title: "Kegiatan Luar Asrama",
    link: "#",
    thumbnail:
      "/assets/gallery/akh-7.jpg",
  },
];
