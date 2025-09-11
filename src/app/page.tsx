import Navigation from "@/components/navbar/Navigation";
import Footer from "@/components/footer";
import Home from "@/app/page/Home";
import { FabContact } from "@/components/fab/fab-contact";
import { BackToTopButton } from "@/components/animate/back-to-top-button";

export default function Page() {
  const navItems = [
    { name: "Home", link: "#hero" },
    { name: "Program", link: "#selling" },
    { name: "Alur", link: "#flow" },
    { name: "Jalur Pendaftaran", link: "#jalur" },
    { name: "Gallery", link: "#gallery" },
    { name: "Contact", link: "#faq" },
  ];
  return (
    <div>
      <Navigation navItems={navItems} />
      <Home
        id={[
          "hero",
          "selling",
          "flow",
          "administration",
          "jalur",
          "gallery",
          "faq",
        ]}
      />
      <Footer
        id={[
          "hero",
          "selling",
          "flow",
          "administration",
          "jalur",
          "gallery",
          "faq",
        ]}
      />
      <FabContact />
      <BackToTopButton
        sx={{
          left: { xs: 24, md: 32 },
          right: "auto",
        }}
        scrollThreshold="80%"
        isDebounce={false}
        renderButton={null}
      />
    </div>
  );
}
