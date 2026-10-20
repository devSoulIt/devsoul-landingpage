import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaChevronRight,
  FaCheckCircle,
  FaCogs,
  FaMobileAlt,
  FaPlug,
  FaRobot,
  FaSyncAlt,
  FaUsers,
  FaSearch,
  FaFileSignature,
  FaLaptopCode,
  FaLifeRing,
  FaFileExcel,
  FaWhatsapp,
  FaFileAlt,
  FaChartLine,
  FaHeartbeat,
  FaTruck,
  FaShoppingCart,
  FaIndustry,
  FaGraduationCap,
  FaBuilding,
  FaPlus,
  FaMinus,
  FaExternalLinkAlt,
} from "react-icons/fa";
import ContactForm from "./ContactForm";

const PRIMARY = "#BDF61D";
// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

// ─── Hero: lo que hoy hace la empresa a mano ──────────────────────────────────
const painPoints = [
  "planillas de Excel",
  "chats de WhatsApp",
  "procesos en papel",
  "tareas manuales",
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % painPoints.length);
        setVisible(true);
      }, 300);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Todas las frases se apilan en la misma celda de la grilla: el contenedor toma el
  // tamaño de la más larga y el resto de la página no se mueve al rotar.
  return (
    <span className="inline-grid align-top">
      {painPoints.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className="[grid-area:1/1] whitespace-nowrap transition-all duration-300"
          style={{
            color: ACCENT,
            opacity: i === index && visible ? 1 : 0,
            transform: i === index && visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

// ─── Servicios ────────────────────────────────────────────────────────────────
const services = [
  {
    icon: <FaCogs />,
    title: "Sistemas de gestión a medida",
    desc: "Stock, ventas, turnos, clientes, facturación. Un sistema pensado para cómo trabaja tu empresa, no un enlatado que te obliga a adaptarte.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Apps web y mobile",
    desc: "Portales para clientes, apps para tu equipo en la calle, plataformas y e-commerce. Rápidas, seguras y fáciles de usar.",
  },
  {
    icon: <FaPlug />,
    title: "Integraciones",
    desc: "Conectamos lo que ya usás: ERP, CRM, Mercado Pago, AFIP, WhatsApp, Google. Que los datos fluyan solos entre sistemas.",
  },
  {
    icon: <FaRobot />,
    title: "Automatización con IA",
    desc: "Agentes que atienden clientes por WhatsApp, califican leads, cargan datos y generan reportes. IA aplicada a problemas reales.",
  },
  {
    icon: <FaSyncAlt />,
    title: "Modernización de sistemas",
    desc: "¿Tu sistema actual es lento, viejo o nadie lo puede tocar? Lo migramos a tecnología actual sin frenar tu operación.",
  },
  {
    icon: <FaUsers />,
    title: "Equipo dedicado",
    desc: "Desarrolladores que se suman a tu proyecto como parte de tu equipo, con seguimiento y entregas semanales.",
  },
];

// ─── Proyectos ────────────────────────────────────────────────────────────────
const projects = [
  {
    name: "Lemonpad",
    tag: "Plataforma SaaS · Salud",
    img: "/img/casos-de-exito/lemonpad.png",
    link: "https://nutriblock.vercel.app",
    problem: "Los nutricionistas gestionaban pacientes, planes y seguimiento entre planillas y mensajes sueltos.",
    solution: "Una plataforma que conecta al profesional con sus pacientes: planes, seguimiento y comunicación en un solo lugar.",
  },
  {
    name: "Bronovios",
    tag: "Sitio web + panel de administración",
    img: "/img/casos-de-exito/bronovios.png",
    link: "https://www.bronovios.com",
    problem: "Necesitaban captar y gestionar personas interesadas en emigrar, sin depender de procesos manuales.",
    solution: "Sitio público para captar clientes y un panel de control para que el equipo administre todo el proceso.",
  },
  {
    name: "Redapuntes",
    tag: "Plataforma de contenidos · Educación",
    img: "/img/casos-de-exito/red-apuntes.png",
    link: "https://redapuntes.vercel.app",
    problem: "Los recursos universitarios estaban dispersos y eran difíciles de encontrar.",
    solution: "Una plataforma donde los estudiantes encuentran y comparten todo el material que necesitan.",
  },
];

const trustedBy = [
  { name: "Bronovios", img: "/img/quienes-confiaron/bronovios.jpg", link: "https://www.bronovios.com/" },
  { name: "Prendete al Camino", img: "/img/quienes-confiaron/prendete-al-camino.webp", link: "https://www.prendetealcamino.com/" },
  { name: "Belleza Femenina", img: "/img/quienes-confiaron/belleza-femenina.jpg", link: "https://www.instagram.com/belleza_femenina_bf74/" },
  { name: "Instituto San Cristobal", img: "/img/quienes-confiaron/instituto-superior-san-cristobal.png", link: "https://issc.com.ar/" },
  { name: "Willy Donuts", img: "/img/quienes-confiaron/willydonuts.jpg", link: "https://www.instagram.com/willy.donuts/" },
];

// ─── Proceso ──────────────────────────────────────────────────────────────────
const steps = [
  {
    icon: <FaSearch />,
    title: "Diagnóstico",
    desc: "Nos reunimos, entendemos tu operación y detectamos qué conviene resolver primero. Sin costo.",
  },
  {
    icon: <FaFileSignature />,
    title: "Propuesta clara",
    desc: "Alcance, plazos y precio definidos por escrito antes de arrancar. Sin sorpresas.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Desarrollo con demos",
    desc: "Trabajamos en etapas cortas y te mostramos avances reales cada semana. Vos decidís el rumbo.",
  },
  {
    icon: <FaLifeRing />,
    title: "Lanzamiento y soporte",
    desc: "Lo ponemos en producción, capacitamos a tu equipo y seguimos acompañando después de la entrega.",
  },
];

// ─── Diferenciales ────────────────────────────────────────────────────────────
const differentiators = [
  { title: "Trato directo", desc: "Hablás con quienes programan tu proyecto, no con un intermediario." },
  { title: "El código es tuyo", desc: "Todo lo que desarrollamos queda a nombre de tu empresa." },
  { title: "IA cuando suma", desc: "Integramos inteligencia artificial donde genera valor real, no por moda." },
  { title: "Pensado para crecer", desc: "Tecnología moderna que escala con tu negocio y es fácil de mantener." },
];

const team = [
  { name: "Lautaro", img: "/img/Nosotros/Lautaro - DS.jpeg" },
  { name: "Marce", img: "/img/Nosotros/Marce - DS.jpeg" },
  { name: "Pablo", img: "/img/Nosotros/Pablo - DS.jpeg" },
];

const stack = ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "APIs REST", "WhatsApp API", "OpenAI / Claude", "Vercel", "AWS"];

const industries = [
  { icon: <FaHeartbeat />, name: "Salud" },
  { icon: <FaShoppingCart />, name: "Comercio y retail" },
  { icon: <FaTruck />, name: "Logística" },
  { icon: <FaIndustry />, name: "Industria" },
  { icon: <FaGraduationCap />, name: "Educación" },
  { icon: <FaBuilding />, name: "Servicios profesionales" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "¿Cuánto cuesta desarrollar un sistema?",
    a: "Depende del alcance. Después del diagnóstico gratuito te pasamos una propuesta con precio cerrado por etapas, así sabés exactamente qué pagás y qué recibís.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Una primera versión funcionando suele estar en pocas semanas. Arrancamos por lo que más impacto tiene y vamos sumando funcionalidades.",
  },
  {
    q: "¿De quién es el código?",
    a: "De tu empresa. Te entregamos el código fuente, los accesos y la documentación.",
  },
  {
    q: "¿Qué pasa después de la entrega?",
    a: "Ofrecemos soporte y mantenimiento mensual para corregir, mejorar y sumar funcionalidades a medida que tu negocio crece.",
  },
  {
    q: "No sé bien qué necesito, ¿igual puedo consultar?",
    a: "Sí, para eso está el diagnóstico. Nos contás cómo trabajan hoy y te decimos qué conviene resolver, aunque no sea con nosotros.",
  },
];

// ─── Reusables ────────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, desc, center = false }) {
  return (
    <div className={`mb-14 ${center ? "text-center" : ""}`}>
      <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: ACCENT }}>
        {eyebrow}
      </p>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{title}</h2>
      {desc && (
        <p className={`text-zinc-600 max-w-2xl ${center ? "mx-auto" : ""}`}>{desc}</p>
      )}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* Antes */}
      <div
        className="rounded-2xl border p-5 mb-4 md:w-[80%]"
        style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
      >
        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Hoy</p>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <FaFileExcel />, label: "stock_final_v3.xlsx" },
            { icon: <FaWhatsapp />, label: "47 chats sin responder" },
            { icon: <FaFileAlt />, label: "Pedidos en papel" },
          ].map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-zinc-200 text-zinc-600 line-through decoration-zinc-400"
            >
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Después */}
      <div
        className="rounded-2xl border p-5 md:ml-[15%]"
        style={{
          borderColor: "rgba(77,124,15,0.35)",
          background: "linear-gradient(135deg, rgba(189,246,29,0.18) 0%, #FFFFFF 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
            Con DevSoul
          </p>
          <span className="flex items-center gap-1.5 text-[10px] text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: PRIMARY }} />
            Tu sistema
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Pedidos hoy", value: "128" },
            { label: "Stock crítico", value: "3" },
            { label: "Consultas IA", value: "Al día" },
          ].map((k) => (
            <div key={k.label} className="rounded-lg bg-zinc-100 p-3">
              <p className="text-[10px] text-zinc-500 mb-1">{k.label}</p>
              <p className="text-lg font-black text-zinc-900">{k.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-zinc-100 p-3">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-3">
            <FaChartLine style={{ color: ACCENT }} /> Ventas de la semana
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[40, 55, 45, 70, 62, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{ height: `${h}%`, backgroundColor: i === 6 ? PRIMARY : "rgba(189,246,29,0.45)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-zinc-900">{q}</span>
        <span className="flex-shrink-0 text-xs" style={{ color: ACCENT }}>
          {open ? <FaMinus /> : <FaPlus />}
        </span>
      </button>
      {open && <p className="pb-5 text-zinc-600 leading-relaxed text-sm">{a}</p>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Main() {
  return (
    <main className="bg-[#FAFAF7] text-zinc-900 overflow-hidden">

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(189,246,29,0.28) 0%, transparent 70%), #FAFAF7",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] mb-8"
                style={{
                  borderColor: "rgba(77,124,15,0.35)",
                  color: ACCENT,
                  backgroundColor: "rgba(189,246,29,0.25)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: PRIMARY }} />
                Software a medida para empresas
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6">
                Convertimos tus
                <br />
                <RotatingWord />
                <br />
                en un sistema hecho para tu empresa.
              </h1>

              <p className="text-lg text-zinc-600 leading-relaxed max-w-lg mb-10">
                Sistemas de gestión, apps web y mobile, integraciones y automatizaciones con IA. Diseñados alrededor de cómo trabaja tu equipo, no al revés.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo("#contacto")}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[#080808] transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Agendá un diagnóstico gratis
                  <FaArrowRight className="text-sm" />
                </button>
                <button
                  onClick={() => scrollTo("#proyectos")}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-zinc-900 border border-zinc-300 hover:border-zinc-400 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Ver proyectos
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-zinc-500 text-sm">
                {["Precio cerrado por etapas", "Avances cada semana", "El código es tuyo"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <FaCheckCircle style={{ color: ACCENT }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="servicios" className="py-24 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            eyebrow="Qué hacemos"
            title="Software que resuelve problemas concretos"
            desc="Desde un sistema interno hasta una app para tus clientes. Si tu empresa lo hace a mano, probablemente se pueda automatizar."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(77,124,15,0.4)] hover:shadow-lg"
                style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 text-[#080808]"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROYECTOS ── */}
      <section id="proyectos" className="py-24 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            eyebrow="Proyectos"
            title="Lo que ya construimos"
            desc="Algunos proyectos que hoy están en producción."
          />
          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(77,124,15,0.4)] hover:shadow-lg"
                style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
              >
                <div className="aspect-video overflow-hidden bg-zinc-100">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">{p.tag}</p>
                  <h3 className="flex items-center gap-2 text-xl font-black text-zinc-900 mb-4">
                    {p.name}
                    <FaExternalLinkAlt className="text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  </h3>
                  <p className="text-sm text-zinc-500 mb-3">
                    <span className="font-semibold text-zinc-700">Desafío: </span>
                    {p.problem}
                  </p>
                  <p className="text-sm text-zinc-500">
                    <span className="font-semibold" style={{ color: ACCENT }}>Solución: </span>
                    {p.solution}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTES ── */}
      <section className="py-16 border-t border-zinc-200 overflow-hidden">
        <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-10 px-6">
          Confiaron en nosotros
        </p>
        <div className="logo-marquee-wrapper">
          <div className="logo-marquee-track">
            {Array.from({ length: 4 }, () => trustedBy)
              .flat()
              .map((logo, index) => (
                <div key={`${logo.name}-${index}`} className="logo-marquee-item opacity-40 hover:opacity-70 transition-opacity">
                  <a href={logo.link} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                    <img src={logo.img} alt={logo.name} className="h-12 w-auto object-contain filter grayscale" />
                  </a>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section id="proceso" className="py-24 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeader
            eyebrow="Cómo trabajamos"
            title="Sabés qué pasa en cada etapa"
            desc="Un proceso simple y transparente, pensado para que no tengas que saber de tecnología."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-2xl border p-7"
                style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl" style={{ color: ACCENT }}>{s.icon}</span>
                  <span className="text-xs font-black tracking-widest text-zinc-600">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section
        id="nosotros"
        className="py-24 border-t border-zinc-200"
        style={{ background: "linear-gradient(180deg, #FAFAF7 0%, rgba(189,246,29,0.10) 50%, #FAFAF7 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <div>
              <SectionHeader
                eyebrow="Por qué DevSoul"
                title="Un equipo chico, senior y comprometido con tu proyecto"
                desc="Somos desarrolladores de Tucumán, Argentina, trabajando con empresas de toda Latinoamérica. Nos involucramos en tu negocio como si fuera nuestro."
              />
              <div className="flex gap-4">
                {team.map((m) => (
                  <div key={m.name} className="text-center">
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-zinc-200 mb-2"
                    />
                    <p className="text-sm text-zinc-700 font-semibold">{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="rounded-2xl border p-6"
                  style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
                >
                  <FaCheckCircle className="mb-4" style={{ color: ACCENT }} />
                  <h3 className="font-bold text-zinc-900 mb-2">{d.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industrias + stack */}
          <div className="grid md:grid-cols-2 gap-10 mt-20">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Industrias en las que trabajamos</p>
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <span
                    key={ind.name}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700"
                  >
                    <span style={{ color: ACCENT }}>{ind.icon}</span>
                    {ind.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Tecnologías</p>
              <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                  <span key={t} className="text-sm px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <SectionHeader eyebrow="Preguntas frecuentes" title="Lo que siempre nos preguntan" center />
          <div>
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section
        id="contacto"
        className="py-24 border-t border-zinc-200"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(189,246,29,0.22) 0%, transparent 70%), #FAFAF7",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <SectionHeader
            eyebrow="Empecemos"
            title="Contanos qué querés resolver"
            desc="Agendamos una reunión de diagnóstico gratuita. Salís con ideas claras de qué conviene hacer, aunque no trabajes con nosotros."
            center
          />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
