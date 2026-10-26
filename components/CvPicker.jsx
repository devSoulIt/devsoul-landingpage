import { FaFileUpload, FaTimes } from "react-icons/fa";

// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";
export const MAX_CV_MB = 3;
const ACCEPTED = ".pdf,.doc,.docx";

export const readAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Selector de CV que usan la página de empleos y el juego del evento.
export default function CvPicker({ cv, onChange, label = "Adjuntá tu CV *" }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension)) return alert("El CV tiene que ser PDF, DOC o DOCX");
    if (file.size > MAX_CV_MB * 1024 * 1024) return alert(`El CV no puede pesar más de ${MAX_CV_MB} MB`);
    onChange(file);
  };

  if (cv) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3">
        <span className="flex items-center gap-3 text-sm text-zinc-700 min-w-0">
          <FaFileUpload className="flex-shrink-0" style={{ color: ACCENT }} />
          <span className="truncate">{cv.name}</span>
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-zinc-500 hover:text-zinc-900 flex-shrink-0"
          aria-label="Quitar CV"
        >
          <FaTimes />
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-400 px-4 py-6 cursor-pointer transition-colors text-center">
      <FaFileUpload className="text-2xl" style={{ color: ACCENT }} />
      <span className="text-sm font-semibold text-zinc-700">{label}</span>
      <span className="text-xs text-zinc-500">PDF, DOC o DOCX · máximo {MAX_CV_MB} MB</span>
      <input type="file" accept={ACCEPTED} className="hidden" onChange={handleFile} />
    </label>
  );
}
