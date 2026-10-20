import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { FaArrowRight } from "react-icons/fa";

const menuItems = [
  { name: "Servicios", link: "#servicios" },
  { name: "Proyectos", link: "#proyectos" },
  { name: "Cómo trabajamos", link: "#proceso" },
  { name: "Nosotros", link: "#nosotros" },
  { name: "Preguntas", link: "#faq" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fuera del home la sección no existe: navegamos al home con el ancla.
      window.location.href = `/${sectionId}`;
    }
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.08)]"
          : "bg-transparent"
      }`}
    >
      <NavbarContent>
        <NavbarBrand>
          <a
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("#hero")}
          >
            <img
              src="/img/logos/isotipo 1.png"
              alt="DevSoul logo"
              className="object-cover h-10 w-10"
            />
            <span className="text-zinc-900 font-bold text-lg tracking-tight">
              Dev<span style={{ color: "#4D7C0F" }}>Soul</span>
            </span>
          </a>
        </NavbarBrand>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="sm:hidden text-zinc-900"
        />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item, i) => (
          <NavbarItem key={i}>
            <button
              onClick={() => scrollToSection(item.link)}
              className="text-zinc-600 hover:text-zinc-900 transition-colors duration-200 text-sm tracking-tight relative group"
            >
              {item.name}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: "#BDF61D" }}
              />
            </button>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            onClick={() => scrollToSection("#contacto")}
            className="text-[#080808] font-bold rounded-lg text-sm px-5"
            style={{ backgroundColor: "#BDF61D" }}
          >
            Hablemos
            <FaArrowRight className="ml-1 text-xs" />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-white/98 backdrop-blur-md border-t border-zinc-200 pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <button
              onClick={() => scrollToSection(item.link)}
              className="w-full text-left text-zinc-700 hover:text-zinc-900 transition-colors duration-200 py-3 px-4 font-medium border-b border-zinc-200"
            >
              {item.name}
            </button>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-4">
          <Button
            onClick={() => scrollToSection("#contacto")}
            className="w-full font-bold text-[#080808]"
            style={{ backgroundColor: "#BDF61D" }}
          >
            Hablemos
            <FaArrowRight className="ml-2" />
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
