import Navigation from "@/components/navbar/Navigation";
import Footer from "@/components/footer";
import Home from "@/app/page/Home";

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
    </div>
  );
}
