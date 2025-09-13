"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from "./resizable-navbar";
import { useState } from "react";
import Button from "../ui/buttonCustom";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function Navigation({
  navItems,
}: {
  navItems: { name: string; link: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Navbar className={montserrat.className}>
        {/* Dekstop */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
        </NavBody>
        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)} // Close the menu when an item is clicked
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsOpen(false)} // Close the menu when an item is clicked
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <Button
                size="md"
                isGradient={false}
                text="Daftar Sekarang"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/registant";
                }}
              />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
}
