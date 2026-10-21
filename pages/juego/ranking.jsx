import { useEffect, useState } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import QRCode from "qrcode";
import RankingList from "../../components/RankingList";

// Verde oscuro para texto e íconos: el lima no tiene contraste sobre fondo claro.
const ACCENT = "#4D7C0F";
const REFRESH_MS = 5000;

// Pantalla para la TV del stand: ranking del día en vivo + QR para jugar.
export default function RankingStand() {
  const [rows, setRows] = useState([]);
  const [qr, setQr] = useState("");
  const [gameUrl, setGameUrl] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/juego`;
    setGameUrl(url.replace(/^https?:\/\//, ""));
    QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#18181B", light: "#FFFFFF" } }).then(setQr);
  }, []);

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

        <div className="col-span-2 sticky top-10 rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="text-3xl font-black mb-2">¡Escaneá y jugá!</p>
          <p className="text-lg text-zinc-600 mb-8">El mejor puntaje del día gana un premio</p>
          <div className="mx-auto w-full max-w-sm aspect-square" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="mt-6 text-lg font-semibold text-zinc-500">{gameUrl}</p>
        </div>
      </div>
    </div>
  );
}
