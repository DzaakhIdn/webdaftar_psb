"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/gallery_paralax";

export default function HeroParallaxDemo({ id }: { id: string }) {
  return <HeroParallax products={products} id={id} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "#",
    thumbnail:
      "/assets/karya/img-1.png",
  },
  {
    title: "Cursor",
    link: "#",
    thumbnail:
      "/assets/karya/img-2.png",
  },
  {
    title: "Rogue",
    link: "#",
    thumbnail:
      "/assets/karya/img-3.png",
  },

  {
    title: "Editorially",
    link: "#",
    thumbnail:
      "/assets/karya/img-4.png",
  },
  {
    title: "Editrix AI",
    link: "#",
    thumbnail:
      "/assets/karya/img-5.png",
  },
  {
    title: "Pixel Perfect",
    link: "#",
    thumbnail:
      "/assets/karya/img-6.png",
  },

  {
    title: "Algochurn",
    link: "#",
    thumbnail:
      "/assets/karya/img-7.png",
  },
  {
    title: "Aceternity UI",
    link: "#",
    thumbnail:
      "/assets/karya/img-8.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "#",
    thumbnail:
      "/assets/karya/img-9.png",
  },
  {
    title: "SmartBridge",
    link: "#",
    thumbnail:
      "/assets/karya/img-10.png",
  },
  {
    title: "Renderwork Studio",
    link: "#",
    thumbnail:
      "/assets/karya/img-11.png",
  },

  {
    title: "Creme Digital",
    link: "#",
    thumbnail:
      "/assets/karya/img-12.png",
  },
  {
    title: "Golden Bells Academy",
    link: "#",
    thumbnail:
      "/assets/karya/img-13.png",
  },
  {
    title: "Invoker Labs",
    link: "#",
    thumbnail:
      "/assets/karya/img-14.png",
  },
  {
    title: "E Free Invoice",
    link: "#",
    thumbnail:
      "/assets/karya/img-15.png",
  },
];
