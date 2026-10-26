import { useEffect, useState } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import axios from "axios";
import { FaArrowRight, FaRedo, FaTrophy } from "react-icons/fa";
import StackGame from "../../components/StackGame";
import RankingList from "../../components/RankingList";
import CvPicker, { readAsBase64 } from "../../components/CvPicker";

const PRIMARY = "#BDF61D";
// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";
const STORAGE_KEY = "devsoul-juego-player";

const readPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};
const savePlayer = (player) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch {}
};

const errorMessage = (err, fallback) => err.response?.data?.message || fallback;

export default function Juego() {
  // registro → listo → jugando → resultado
  const [step, setStep] = useState("cargando");
  const [player, setPlayer] = useState(null);
  const [session, setSession] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = readPlayer();
    setPlayer(saved);
    setStep(saved?.playerId ? "listo" : "registro");
  }, []);

  const handleRegistered = (p) => {
    savePlayer(p);
    setPlayer(p);
    setStep("listo");
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/juego/start", { playerId: player.playerId });
      setSession(data.sessionId);
      setStep("jugando");
    } catch (err) {
      if (err.response?.status === 401) {
        // El jugador guardado ya no existe en el servidor: hay que registrarse de nuevo.
        setStep("registro");
      } else {
        alert(errorMessage(err, "No se pudo iniciar la partida"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGameOver = async (taps) => {
    try {
      const { data } = await axios.post("/api/juego/finish", { sessionId: session, taps });
      setResult(data);
    } catch (err) {
      setResult({ error: errorMessage(err, "No se pudo guardar la partida") });
    }
    setStep("resultado");
  };

  return (
    <div
      className="min-h-[100dvh] text-zinc-900 flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 90% 40% at 50% -5%, rgba(189,246,29,0.3) 0%, transparent 70%), #FAFAF7",
      }}
    >
      <NextSeo
        title="DevSoul | Construí tu sistema"
        description="Jugá a Construí tu sistema y competí por premios en el stand de DevSoul."
        canonical="https://www.devsoulit.com/juego"
        noindex
      />
      <Head>
        <link rel="icon" href="/img/logos/isotipo 1.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <header className="flex items-center justify-between px-5 py-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/img/logos/isotipo 1.png" alt="DevSoul logo" className="h-8 w-8 object-cover" />
          <span className="font-bold tracking-tight">
            Dev<span style={{ color: ACCENT }}>Soul</span>
          </span>
        </a>
        {player?.name && step !== "registro" && (
          <span className="text-xs text-zinc-500 truncate max-w-[50%]">Jugando como {player.name}</span>
        )}
      </header>

      {step === "registro" && <Registro onRegistered={handleRegistered} />}

      {step === "listo" && (
        <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-5 pb-10">
          <Intro />
          <button
            onClick={startGame}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[#080808] text-lg transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}
          >
            {loading ? "Preparando..." : "¡Empezar a construir!"}
            {!loading && <FaArrowRight />}
          </button>
          <button
            onClick={() => setStep("registro")}
            className="mt-4 text-xs text-zinc-500 underline underline-offset-2"
          >
            No soy {player?.name}
          </button>
        </main>
      )}

      {step === "jugando" && (
        <main className="flex-1 relative">
          <div className="absolute inset-0">
            <StackGame onGameOver={handleGameOver} />
          </div>
        </main>
      )}

      {step === "resultado" && result && (
        <Resultado result={result} onRetry={startGame} loading={loading} />
      )}
    </div>
  );
}

function Intro() {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
        Juego DevSoul
      </p>
      <h1 className="text-4xl font-black tracking-tight leading-tight mb-4">Construí tu sistema</h1>
      <ul className="space-y-2 text-zinc-600 text-sm mb-4">
        <li>🧱 Tocá la pantalla para apilar cada bloque.</li>
        <li>✂️ Lo que sobresale se corta: cada piso queda más angosto.</li>
        <li>🎯 Si encajás perfecto, el bloque mantiene su ancho.</li>
        <li>🏆 El mejor puntaje de cada día se lleva un premio.</li>
      </ul>
      <p className="text-xs text-zinc-500">Podés jugar todas las veces que quieras: cuenta tu mejor partida del día.</p>
    </div>
  );
}

function Registro({ onRegistered }) {
  const [data, setData] = useState({ name: "", company: "", email: "", phone: "" });
  const [cv, setCv] = useState(null);
  const [sending, setSending] = useState(false);
  const set = (field) => (e) => setData((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name) return alert("Completá tu nombre");
    if (!data.email) return alert("Completá tu email");
    setSending(true);
    try {
      const { data: res } = await axios.post("/api/juego/registro", data);
      if (cv) await sendCv();
      onRegistered({ playerId: res.playerId, name: res.name });
    } catch (err) {
      alert(errorMessage(err, "No se pudo completar el registro"));
    } finally {
      setSending(false);
    }
  };

  // El CV es opcional: si no se puede enviar, avisamos pero igual se juega.
  const sendCv = async () => {
    try {
      const cvBase64 = await readAsBase64(cv);
      await axios.post("/api/postulacion", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.company ? `Empresa: ${data.company}` : "",
        cvName: cv.name,
        cvBase64,
        source: "juego",
      });
    } catch (err) {
      alert(`${errorMessage(err, "No pudimos enviar tu CV")}. Igual ya podés jugar.`);
    }
  };

  const inputClass =
    "w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder-zinc-400 text-base focus:outline-none focus:border-zinc-400 transition-colors";

  return (
    <main className="flex-1 max-w-md mx-auto w-full px-5 pb-10">
      <Intro />
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className={inputClass} placeholder="Nombre y apellido *" autoComplete="name" value={data.name} onChange={set("name")} />
        <input className={inputClass} placeholder="Empresa" autoComplete="organization" value={data.company} onChange={set("company")} />
        <input className={inputClass} type="email" placeholder="Email *" autoComplete="email" value={data.email} onChange={set("email")} />
        <input className={inputClass} type="tel" placeholder="Teléfono / WhatsApp" autoComplete="tel" value={data.phone} onChange={set("phone")} />
        <CvPicker cv={cv} onChange={setCv} label="¿Buscás trabajo? Sumá tu CV (opcional)" />
        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[#080808] text-lg transition-all hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: PRIMARY }}
        >
          {sending ? (cv ? "Enviando tu CV..." : "Registrando...") : "Jugar"}
          {!sending && <FaArrowRight />}
        </button>
        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Usamos tus datos para el ranking y para contactarte si ganás. En el ranking solo se ve tu nombre y tu empresa. Si sumás tu CV, lo leemos y te escribimos cuando haya una búsqueda que encaje con tu perfil.
        </p>
      </form>
    </main>
  );
}

function Resultado({ result, onRetry, loading }) {
  if (result.error) {
    return (
      <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-5 pb-10 text-center">
        <p className="text-zinc-600 mb-6">{result.error}</p>
        <RetryButton onRetry={onRetry} loading={loading} />
      </main>
    );
  }

  const isRecord = result.floors > 0 && result.floors >= result.best;

  return (
    <main className="flex-1 max-w-md mx-auto w-full px-5 pb-10">
      <div className="text-center mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: ACCENT }}>
          {isRecord ? "¡Nuevo récord personal!" : "Fin de la partida"}
        </p>
        <p className="text-7xl font-black">{result.floors}</p>
        <p className="text-zinc-500 text-sm">
          {result.floors === 1 ? "piso construido" : "pisos construidos"}
          {result.perfects > 0 && ` · ${result.perfects} encaje${result.perfects === 1 ? "" : "s"} perfecto${result.perfects === 1 ? "" : "s"}`}
        </p>
        {result.position && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold" style={{ backgroundColor: "rgba(189,246,29,0.35)" }}>
            <FaTrophy style={{ color: ACCENT }} />
            Estás en el puesto #{result.position} de hoy · tu mejor: {result.best}
          </p>
        )}
      </div>

      <RetryButton onRetry={onRetry} loading={loading} />

      <RankingList rows={result.ranking} />

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 text-center">
        <p className="font-bold mb-1">¿Y si construimos el tuyo de verdad?</p>
        <p className="text-sm text-zinc-600 mb-4">Agendá un diagnóstico gratuito para tu empresa.</p>
        <a href="/evento" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: ACCENT }}>
          Quiero el diagnóstico <FaArrowRight className="text-xs" />
        </a>
      </div>
    </main>
  );
}

function RetryButton({ onRetry, loading }) {
  return (
    <button
      onClick={onRetry}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[#080808] text-lg transition-all hover:opacity-90 disabled:opacity-60"
      style={{ backgroundColor: PRIMARY }}
    >
      <FaRedo className="text-base" />
      {loading ? "Preparando..." : "Jugar de nuevo"}
    </button>
  );
}
