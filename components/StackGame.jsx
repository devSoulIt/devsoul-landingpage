import { useEffect, useRef, useState } from "react";
import {
  WIDTH,
  BLOCK_HEIGHT,
  MIN_TAP_GAP,
  initialState,
  movingX,
  place,
  floorsOf,
  layerName,
} from "../lib/stackGame";

// Verde que se va oscureciendo a medida que sube la torre.
const blockColor = (level) => {
  const shades = ["#BDF61D", "#A8E00F", "#93C90C", "#7EB10A", "#699908", "#93C90C", "#A8E00F"];
  return shades[(level - 1) % shades.length];
};

// Altura en pantalla (px) del piso `level`, según la escala y la cámara actuales.
const levelY = (g, level) => g.cssH * 0.78 - (level + 1) * BLOCK_HEIGHT * g.scale + g.camera;

// Juego "Construí tu sistema". Llama a onGameOver(taps) cuando el jugador falla.
// `taps` son los ms (enteros) desde el inicio en que tocó la pantalla.
export default function StackGame({ onGameOver }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const game = useRef({
    state: initialState(),
    taps: [],
    t0: 0,
    camera: 0,
    debris: [],
    flash: 0,
    finished: false,
    scale: 1,
    cssH: 0,
  });
  const [floors, setFloors] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const g = game.current;
    g.t0 = performance.now();
    let raf;

    const resize = () => {
      const { width, height } = wrapRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const cssW = canvas.width / (window.devicePixelRatio || 1);
      const cssH = canvas.height / (window.devicePixelRatio || 1);
      const scale = cssW / WIDTH;
      const bh = BLOCK_HEIGHT * scale;
      g.scale = scale;
      g.cssH = cssH;
      const now = performance.now();
      const t = now - g.t0;
      const { state } = g;

      // La cámara sube para que el bloque en movimiento no pase del ~40% superior de la pantalla.
      const targetCamera = Math.max(0, (state.blocks.length + 1) * bh - cssH * 0.38);
      g.camera += (targetCamera - g.camera) * 0.12;
      const yOf = (level) => levelY(g, level);

      ctx.clearRect(0, 0, cssW, cssH);

      const drawBlock = (x, width, level, color, label) => {
        const px = x * scale;
        const pw = width * scale;
        const py = yOf(level);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(px, py, pw, bh - 2, 5);
        ctx.fill();
        if (label && pw > 64) {
          ctx.fillStyle = level === 0 ? "#FFFFFF" : "#080808";
          ctx.font = `${Math.max(10, 11 * scale)}px ParalucentBold, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, px + pw / 2, py + (bh - 2) / 2, pw - 8);
        }
      };

      state.blocks.forEach((b, level) => {
        drawBlock(b.x, b.width, level, level === 0 ? "#18181B" : blockColor(level), level === 0 ? "Tu empresa" : layerName(level));
      });

      // Pedazos recortados que caen
      g.debris = g.debris.filter((d) => d.y < cssH + 200);
      g.debris.forEach((d) => {
        d.vy += 0.5;
        d.y += d.vy;
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x * scale, d.y, d.width * scale, bh - 2);
        ctx.globalAlpha = 1;
      });

      if (!state.over) {
        const level = state.blocks.length;
        const prev = state.blocks[level - 1];
        drawBlock(movingX(state, t), prev.width, level, blockColor(level), layerName(level));
      }

      if (g.flash > 0) {
        ctx.globalAlpha = g.flash;
        ctx.fillStyle = "#4D7C0F";
        ctx.font = `${20 * scale}px ParalucentBold, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("¡Encaje perfecto!", cssW / 2, yOf(state.blocks.length) - 30 * scale);
        ctx.globalAlpha = 1;
        g.flash -= 0.02;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleTap = (e) => {
    e.preventDefault();
    const g = game.current;
    if (g.finished) return;
    const t = Math.round(performance.now() - g.t0);
    const last = g.taps[g.taps.length - 1] ?? 0;
    if (t < last + MIN_TAP_GAP) return;

    const prevState = g.state;
    const prev = prevState.blocks[prevState.blocks.length - 1];
    const x = movingX(prevState, t);
    const next = place(prevState, t);
    g.taps.push(t);
    g.state = next;

    const level = prevState.blocks.length;
    if (next.over) {
      g.finished = true;
      g.debris.push({ x, width: prev.width, y: levelY(g, level), vy: 0, color: blockColor(level) });
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => onGameOver([...g.taps]), 900);
      return;
    }

    const placed = next.blocks[next.blocks.length - 1];
    if (placed.perfect) {
      g.flash = 1;
      if (navigator.vibrate) navigator.vibrate(30);
    } else {
      // Lo que sobresale se corta y cae.
      const y = levelY(g, level);
      const cutX = x < placed.x ? x : placed.x + placed.width;
      const cutW = prev.width - placed.width;
      if (cutW > 0.5) g.debris.push({ x: cutX, width: cutW, y, vy: 0, color: blockColor(level) });
    }
    setFloors(floorsOf(next));
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={handleTap}
      className="relative w-full h-full select-none cursor-pointer"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="block" />
      <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-6xl font-black text-zinc-900">{floors}</p>
        <p className="text-xs uppercase tracking-widest text-zinc-500">
          {floors === 1 ? "piso" : "pisos"}
        </p>
      </div>
      {floors === 0 && (
        <p className="absolute bottom-6 left-0 right-0 text-center text-sm font-semibold text-zinc-600 pointer-events-none animate-pulse">
          Tocá la pantalla para apilar el bloque
        </p>
      )}
    </div>
  );
}
