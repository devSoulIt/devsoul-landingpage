import { useState } from "react";
import axios from "axios";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const PRIMARY = "#BDF61D";
// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";

// `source` se antepone al mensaje para identificar de dónde vino el lead (ej: "Evento").
// `compact` muestra solo los campos esenciales (para la página del evento, desde el celular).
export default function ContactForm({ source, compact = false }) {
  const [data, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name) return alert("Completá tu nombre");
    if (!data.email) return alert("Completá tu email");
    if (!data.message) return alert("Contanos qué necesitás");
    setSubmitting(true);
    try {
      await axios.post("/api/sendmail", {
        ...data,
        message: source ? `[${source}] ${data.message}` : data.message,
      });
      setSubmitted(true);
    } catch {
      alert("Ocurrió un error. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl border p-12 text-center"
        style={{ borderColor: "rgba(77,124,15,0.35)", backgroundColor: "rgba(189,246,29,0.15)" }}
      >
        <FaCheckCircle className="text-5xl mx-auto mb-6" style={{ color: ACCENT }} />
        <h3 className="text-2xl font-black text-zinc-900 mb-3">¡Mensaje recibido!</h3>
        <p className="text-zinc-600">
          Te escribimos en las próximas 24 horas para coordinar la reunión.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 text-base md:text-sm focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border p-6 md:p-8 space-y-4"
      style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "#FFFFFF" }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className={inputClass}
          placeholder="Nombre *"
          autoComplete="name"
          value={data.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        />
        <input
          className={inputClass}
          placeholder="Empresa"
          autoComplete="organization"
          value={data.company}
          onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          className={inputClass}
          type="email"
          placeholder="Email *"
          autoComplete="email"
          value={data.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        />
        <input
          className={inputClass}
          type="tel"
          placeholder="Teléfono / WhatsApp"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
        />
      </div>
      <textarea
        className={`${inputClass} resize-none`}
        rows={compact ? 3 : 4}
        placeholder={
          compact
            ? "¿Qué te gustaría resolver? *"
            : "Contanos qué necesitás: un sistema, una app, automatizar algo... *"
        }
        value={data.message}
        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[#080808] text-base transition-all duration-200 hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: PRIMARY }}
      >
        {submitting ? "Enviando..." : "Quiero una reunión"}
        {!submitting && <FaArrowRight />}
      </button>
      <p className="text-center text-zinc-500 text-xs">
        Sin compromiso · Respuesta en 24h · Diagnóstico inicial gratis
      </p>
    </form>
  );
}
