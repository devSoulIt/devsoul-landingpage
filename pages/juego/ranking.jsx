import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import QRCode from "qrcode";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RankingList from "../../components/RankingList";
import ClaudeMascot from "../../components/ClaudeMascot";
import { ANIMATIONS, ANIMATION_MS } from "../../components/StandAnimations";

// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";
const REFRESH_MS = 5000;
const QR_MS = 15000;
// QR, animación, QR, otra animación... y vuelve a empezar.
const SLIDES = ANIMATIONS.flatMap((_, i) => ["qr", i]);

// Pantalla para la TV del stand: ranking del día en vivo + QR para jugar.
export default function RankingStand() {
  const [rows, setRows] = useState([]);
  const [qr, setQr] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [slide, setSlide] = useState(0);
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);

  useEffect(() => {
    const url = `${window.location.origin}/juego`;
    setGameUrl(url.replace(/^https?:\/\//, ""));
    QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#18181B", light: "#FFFFFF" } }).then(setQr);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setTimeout(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDES[slide] === "qr" ? QR_MS : ANIMATION_MS);
    return () => clearTimeout(id);
  }, [slide, reduceMotion]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/juego/ranking");
        const data = await res.json();
        if (active && data.success) setRows(data.ranking);
      } catch {}
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-zinc-900 px-10 py-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(189,246,29,0.35) 0%, transparent 70%), #FAFAF7",
      }}
    >
      <NextSeo title="DevSoul | Ranking en vivo" noindex nofollow />
      <Head>
        <link rel="icon" href="/img/logos/isotipo 1.png" />
      </Head>

      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-12 items-start">
        <div className="col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <img src="/img/logos/isotipo 1.png" alt="DevSoul logo" className="h-12 w-12 object-cover" />
            <span className="text-2xl font-bold tracking-tight">
              Dev<span style={{ color: ACCENT }}>Soul</span>
            </span>
          </div>
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-2" style={{ color: ACCENT }}>
            Ranking de hoy · en vivo
          </p>
          <h1 className="text-6xl font-black tracking-tight mb-10">Construí tu sistema</h1>
          <RankingList rows={rows} large />
        </div>

        <div ref={cardRef} className="col-span-2 sticky top-10 h-[680px] overflow-hidden rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              className="h-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              {SLIDES[slide] === "qr" || reduceMotion ? <QrPanel qr={qr} gameUrl={gameUrl} /> : <Animation index={SLIDES[slide]} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {!reduceMotion && <ClaudeMascot targetRef={cardRef} />}
    </div>
  );
}

function QrPanel({ qr, gameUrl }) {
  return (
    <>
      <p className="text-3xl font-black mb-2">¡Escaneá y jugá!</p>
      <p className="text-lg text-zinc-600 mb-8">El mejor puntaje del día gana un premio</p>
      <div className="mx-auto w-full max-w-sm aspect-square" dangerouslySetInnerHTML={{ __html: qr }} />
      <p className="mt-6 text-lg font-semibold text-zinc-500">{gameUrl}</p>
    </>
  );
}

function Animation({ index }) {
  const Component = ANIMATIONS[index];
  return <Component />;
}
