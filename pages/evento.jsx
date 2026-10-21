import Head from "next/head";
import { NextSeo } from "next-seo";
import { FaCheckCircle, FaEnvelope, FaArrowRight } from "react-icons/fa";
import ContactForm from "../components/ContactForm";

const PRIMARY = "#BDF61D";
// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";

// Landing a la que apunta el QR del stand. Los leads llegan con el prefijo [Evento].
export default function Evento() {
  return (
    <div
      className="min-h-screen text-zinc-900"
      style={{
        background:
          "radial-gradient(ellipse 90% 40% at 50% -5%, rgba(189,246,29,0.3) 0%, transparent 70%), #FAFAF7",
      }}
    >
      <NextSeo
        title="DevSoul | Diagnóstico gratuito"
        description="Diagnóstico gratuito para asistentes al evento: te ayudamos a convertir tus procesos manuales en un sistema hecho para tu empresa."
        canonical="https://www.devsoulit.com/evento"
        noindex
      />
      <Head>
        <link rel="icon" href="/img/logos/isotipo 1.png" />
      </Head>

      <div className="max-w-xl mx-auto px-5 py-10">
        <a href="/" className="flex items-center gap-3 mb-10">
          <img src="/img/logos/isotipo 1.png" alt="DevSoul logo" className="h-9 w-9 object-cover" />
          <span className="font-bold text-lg tracking-tight">
            Dev<span style={{ color: ACCENT }}>Soul</span>
          </span>
        </a>

        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] mb-6"
          style={{ borderColor: "rgba(77,124,15,0.35)", color: ACCENT, backgroundColor: "rgba(189,246,29,0.25)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: PRIMARY }} />
          Beneficio para asistentes
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4">
          Diagnóstico gratuito de 30 minutos para tu empresa
        </h1>
        <p className="text-zinc-600 leading-relaxed mb-8">
          Nos contás cómo trabajan hoy y te decimos qué procesos conviene pasar a un sistema, una app o automatizar con IA. Sin compromiso.
        </p>

        <ul className="space-y-3 mb-10">
          {[
            "Sistemas de gestión a medida",
            "Apps web y mobile",
            "Integraciones con lo que ya usás",
            "Automatización con IA (WhatsApp, reportes, carga de datos)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-zinc-700">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
              {item}
            </li>
          ))}
        </ul>

        <a
          href="/juego"
          className="flex items-center justify-between gap-4 rounded-2xl border p-5 mb-8 transition-all hover:-translate-y-0.5"
          style={{ borderColor: "rgba(77,124,15,0.35)", backgroundColor: "rgba(189,246,29,0.2)" }}
        >
          <span>
            <span className="block font-black text-lg">🏆 Jugá y ganá premios</span>
            <span className="block text-sm text-zinc-600">Construí tu sistema: el mejor puntaje del día gana.</span>
          </span>
          <FaArrowRight className="flex-shrink-0" style={{ color: ACCENT }} />
        </a>

        <ContactForm source="Evento" compact />

        <div className="mt-10 flex flex-col gap-3 text-sm">
          <a href="mailto:hello@devsoulit.com" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <FaEnvelope /> hello@devsoulit.com
          </a>
          <a href="/#proyectos" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            Ver nuestros proyectos <FaArrowRight className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}
