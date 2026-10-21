import { useState } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import axios from "axios";
import { FaArrowRight, FaCheckCircle, FaFileUpload, FaTimes } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PRIMARY = "#BDF61D";
// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";

const MAX_CV_MB = 3;
const ACCEPTED = ".pdf,.doc,.docx";

const areas = [
  "Desarrollo frontend",
  "Desarrollo backend",
  "Desarrollo fullstack",
  "Desarrollo mobile",
  "IA y automatización",
  "Diseño UX/UI",
  "Otra",
];

const perks = [
  "Proyectos reales para empresas de toda Latinoamérica",
  "Trato directo con los fundadores, sin capas intermedias",
  "Tecnología moderna: React, Next.js, Node.js e IA",
];

const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function TrabajaConNosotros() {
  const [data, setData] = useState({ name: "", email: "", phone: "", link: "", area: "", message: "", website: "" });
  const [cv, setCv] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setData((p) => ({ ...p, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension)) return alert("El CV tiene que ser PDF, DOC o DOCX");
    if (file.size > MAX_CV_MB * 1024 * 1024) return alert(`El CV no puede pesar más de ${MAX_CV_MB} MB`);
    setCv(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name) return alert("Completá tu nombre");
    if (!data.email) return alert("Completá tu email");
    if (!cv) return alert("Adjuntá tu CV");
    setSubmitting(true);
    try {
      const cvBase64 = await readAsBase64(cv);
      await axios.post("/api/postulacion", { ...data, cvName: cv.name, cvBase64 });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.status === 400 ? err.response.data.message : "Ocurrió un error. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 text-base md:text-sm focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <div className="bg-[#FAFAF7] text-zinc-900">
      <NextSeo
        title="DevSoul | Trabajá con nosotros"
        description="Sumate a DevSoul: desarrollamos software a medida para empresas. Dejanos tus datos y tu CV."
        canonical="https://www.devsoulit.com/trabaja-con-nosotros"
      />
      <Head>
        <link rel="icon" href="/img/logos/isotipo 1.png" />
      </Head>
      <Header />

      <main
        className="pt-32 pb-24"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(189,246,29,0.28) 0%, transparent 70%), #FAFAF7",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: ACCENT }}>
              Trabajá con nosotros
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
              Sumate al equipo de DevSoul
            </h1>
            <p className="text-zinc-600 leading-relaxed mb-8">
              Estamos creciendo y buscamos personas con ganas de construir software que resuelva problemas reales. Dejanos tus datos y tu CV, y te escribimos cuando haya una oportunidad que encaje con tu perfil.
            </p>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-zinc-700">
                  <FaCheckCircle className="mt-0.5 flex-shrink-0" style={{ color: ACCENT }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="rounded-2xl border p-12 text-center"
                style={{ borderColor: "rgba(77,124,15,0.35)", backgroundColor: "rgba(189,246,29,0.15)" }}
              >
                <FaCheckCircle className="text-5xl mx-auto mb-6" style={{ color: ACCENT }} />
                <h2 className="text-2xl font-black mb-3">¡Gracias por postularte!</h2>
                <p className="text-zinc-600">
                  Recibimos tu CV. Lo vamos a revisar y te contactamos si hay una búsqueda que encaje con tu perfil.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border p-6 md:p-8 space-y-4"
                style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
              >
                {/* Honeypot anti-bots: oculto para personas */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value={data.website}
                  onChange={set("website")}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Nombre y apellido *" autoComplete="name" value={data.name} onChange={set("name")} />
                  <input className={inputClass} type="email" placeholder="Email *" autoComplete="email" value={data.email} onChange={set("email")} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className={inputClass} type="tel" placeholder="Teléfono / WhatsApp" autoComplete="tel" value={data.phone} onChange={set("phone")} />
                  <input className={inputClass} placeholder="LinkedIn, GitHub o portfolio" value={data.link} onChange={set("link")} />
                </div>
                <select
                  className={data.area ? inputClass : inputClass.replace("text-zinc-900", "text-zinc-400")}
                  value={data.area}
                  onChange={set("area")}
                >
                  <option value="">Área de interés</option>
                  {areas.map((a) => (
                    <option key={a} value={a} className="text-zinc-900">{a}</option>
                  ))}
                </select>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  placeholder="Contanos un poco sobre vos y tu experiencia"
                  value={data.message}
                  onChange={set("message")}
                />

                {cv ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3">
                    <span className="flex items-center gap-3 text-sm text-zinc-700 min-w-0">
                      <FaFileUpload className="flex-shrink-0" style={{ color: ACCENT }} />
                      <span className="truncate">{cv.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCv(null)}
                      className="text-zinc-500 hover:text-zinc-900 flex-shrink-0"
                      aria-label="Quitar CV"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-400 px-4 py-8 cursor-pointer transition-colors text-center">
                    <FaFileUpload className="text-2xl" style={{ color: ACCENT }} />
                    <span className="text-sm font-semibold text-zinc-700">Adjuntá tu CV *</span>
                    <span className="text-xs text-zinc-500">PDF, DOC o DOCX · máximo {MAX_CV_MB} MB</span>
                    <input type="file" accept={ACCEPTED} className="hidden" onChange={handleFile} />
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[#080808] text-base transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {submitting ? "Enviando..." : "Enviar postulación"}
                  {!submitting && <FaArrowRight />}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
