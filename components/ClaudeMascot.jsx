import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "framer-motion";

const ORANGE = "#D97757";
const INK = "#18181B";
const LIME = "#BDF61D";
// El sprite es una grilla de 22x16 "pixeles" de 4px.
const W = 88;
const H = 64;
const WALK = 120; // px/s
const RUN = 440;
const JUMP_LEN = 170;
const JUMP_S = 0.55;
// Cada cuántas acciones vuelve sí o sí al QR.
const QR_EVERY = 3;
const STOP = Symbol("stop");
// Llegó un puntaje nuevo: corta lo que esté haciendo para ir a festejar.
const NEWS = Symbol("news");
const CONFETTI = ["#BDF61D", ORANGE, "#60A5FA", "#F472B6", "#FBBF24", INK];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const between = (min, max) => min + Math.random() * (max - min);

const LINES = {
  qr: ["¡Escaneá el QR y jugá!", "¿Te animás a jugar?", "El mejor puntaje gana premio 🏆", "¡Escaneá acá arriba! 👆"],
  rank: ["¿Quién va primero?", "¿Y si sos vos? 👆", "Ese récord se puede superar…"],
  hello: ["¡Hola! 👋", "¡Bienvenidos al stand!", "¿Tenés procesos a mano? Hablemos"],
  code: ["Programando tu sistema…", "npm run deploy 🚀", "Compilando… ✅"],
  bug: ["¡Bug arreglado! ✅", "¡Te atrapé, bug!", "Cero bugs en producción 😎"],
  jump: ["¡Nivel completo!", "¡Sin tocar un pinche!", "Geometry Dev 🕹️"],
  dance: ["♪ Deploy un viernes ♪", "¡Pasó el build! 🎉"],
  build: ["¡3 pisos! ¿Vos cuántos?", "Así se construye un sistema"],
};

function Sprite({ mode, lookUp, blink }) {
  const moving = mode === "walk" || mode === "run";
  const sleeping = mode === "sleep";
  const eyeY = lookUp ? 2 : 4;
  const eyeH = lookUp ? 2 : 3;
  const closed = blink || sleeping;
  return (
    <svg width={W} height={H} viewBox="0 0 22 16" shapeRendering="crispEdges" className="block">
      {[4, 8, 12, 16].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          width={2}
          height={mode === "jump" || sleeping ? 2 : 4}
          fill={ORANGE}
          initial={{ y: 11 }}
          animate={moving ? { y: i % 2 ? [11, 9.5, 11] : [9.5, 11, 9.5] } : { y: sleeping ? 12.5 : 11 }}
          transition={moving ? { duration: mode === "run" ? 0.16 : 0.4, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
        />
      ))}
      <motion.g animate={{ y: sleeping ? 1.5 : 0 }} transition={{ duration: 0.3 }}>
        <rect x={3} y={2} width={16} height={9} fill={ORANGE} />
        {[0, 19].map((x, i) => (
          <motion.rect
            key={x}
            x={x}
            width={3}
            height={3}
            fill={ORANGE}
            initial={{ y: 5 }}
            animate={mode === "cheer" ? { y: [5, 1, 5] } : mode === "type" ? { y: [6, 5, 6] } : { y: 5 }}
            transition={
              mode === "cheer" || mode === "type"
                ? { duration: mode === "type" ? 0.2 : 0.35, repeat: Infinity, delay: i * (mode === "type" ? 0.1 : 0.17) }
                : { duration: 0.1 }
            }
          />
        ))}
        {[8, 14].map((x) => (
          <rect key={x} x={x} y={closed ? eyeY + eyeH / 2 : eyeY} width={2} height={closed ? 0.6 : eyeH} fill={INK} />
        ))}
      </motion.g>
    </svg>
  );
}

// Efectos que flotan sobre la mascota (no se espejan ni giran con ella).
function Floaters({ fx }) {
  const glyphs = fx === "zzz" ? ["z", "Z", "z"] : fx === "notes" ? ["♪", "♫", "♪"] : [];
  return glyphs.map((g, i) => (
    <motion.span
      key={`${fx}-${i}`}
      className="absolute bottom-full font-black text-2xl"
      style={{ left: W / 2 + 10, color: fx === "zzz" ? "#71717A" : ORANGE }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0], y: [0, -60], x: [0, i % 2 ? 18 : -10] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
    >
      {g}
    </motion.span>
  ));
}

function Confetti() {
  return Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI - Math.PI;
    const dist = 70 + (i % 4) * 25;
    return (
      <motion.span
        key={i}
        className="absolute w-2.5 h-2.5"
        style={{ left: W / 2, bottom: H / 2, backgroundColor: CONFETTI[i % CONFETTI.length] }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [1, 1, 0],
          x: [0, Math.cos(angle) * dist],
          y: [0, Math.sin(angle) * dist, Math.sin(angle) * dist + 80],
          rotate: [0, 360 + i * 40],
        }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.3, delay: (i % 3) * 0.08 }}
      />
    );
  });
}

function Laptop() {
  return (
    <motion.svg
      width="48"
      height="36"
      viewBox="0 0 12 9"
      shapeRendering="crispEdges"
      className="absolute bottom-0"
      style={{ left: W - 14 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <rect x={1} y={0} width={10} height={7} fill={INK} />
      {[1.5, 3, 4.5].map((y, i) => (
        <motion.rect
          key={y}
          x={2}
          y={y}
          height={0.8}
          fill={LIME}
          initial={{ width: 0 }}
          animate={{ width: [0, 7 - i * 2, 7 - i * 2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      <rect x={0} y={7} width={12} height={2} fill="#52525B" />
    </motion.svg>
  );
}

// La mascota de Claude paseando por abajo de la pantalla del stand.
// Elige acciones al azar; `targetRef` es la tarjeta del QR, a la que vuelve seguido.
// `news` es el último puntaje nuevo del ranking ({ name, floors, position, at }).
export default function ClaudeMascot({ targetRef, news }) {
  const [scope, animate] = useAnimate();
  const bodyRef = useRef(null);
  const bugRef = useRef(null);
  const [pose, setPose] = useState({ mode: "walk", dir: 1, lookUp: false });
  const [say, setSay] = useState(null);
  const [fx, setFx] = useState(null);
  const [spikes, setSpikes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [blink, setBlink] = useState(false);
  const newsRef = useRef(null);
  const wakeRef = useRef(null);

  useEffect(() => {
    if (!news) return;
    newsRef.current = news;
    wakeRef.current?.();
  }, [news]);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    let x = -W - 40;
    let dir = 1;
    let celebrating = false;
    // Se resuelve cuando llega un puntaje nuevo, para no esperar a que termine la acción.
    const armInterrupt = () => new Promise((r) => (wakeRef.current = r));
    let interrupted = armInterrupt();
    const check = () => {
      if (!alive) throw STOP;
      if (newsRef.current && !celebrating) throw NEWS;
    };
    const guard = async (p) => {
      await (celebrating ? p : Promise.race([p, interrupted]));
      check();
    };
    const sleep = (ms) => guard(wait(ms));
    const vw = () => window.innerWidth;
    const minX = () => vw() * 0.04;
    const maxX = () => vw() * 0.96 - W;
    const qrX = () => {
      const r = targetRef.current?.getBoundingClientRect();
      return r ? r.left + r.width / 2 - W / 2 : vw() * 0.75;
    };
    const setDir = (d) => {
      dir = d;
      setPose((p) => ({ ...p, dir: d }));
    };

    const move = async (to, speed, mode) => {
      if (Math.abs(to - x) < 2) return;
      dir = to > x ? 1 : -1;
      setPose({ mode, dir, lookUp: false });
      await guard(animate(scope.current, { x: to }, { duration: Math.abs(to - x) / speed, ease: "linear" }));
      x = to;
    };
    const stand = async (ms, text, pose = {}) => {
      setPose((p) => ({ ...p, mode: "idle", lookUp: false, ...pose }));
      setSay(text);
      await sleep(ms);
      setSay(null);
    };
    const hop = async (h) => {
      await guard(animate(bodyRef.current, { y: [0, -h, 0] }, { duration: 0.4, ease: "easeOut" }));
    };
    const celebrate = async (text, hops = 2) => {
      setPose((p) => ({ ...p, mode: "cheer", lookUp: false }));
      setSay(text);
      for (let i = 0; i < hops; i++) await hop(26);
      await sleep(1600);
      setSay(null);
    };

    // ── Acciones ────────────────────────────────────────────────────────────
    const visitQr = async () => {
      await move(qrX(), Math.random() < 0.5 ? WALK : RUN, Math.random() < 0.5 ? "walk" : "run");
      setPose({ mode: "cheer", dir, lookUp: true });
      setSay(pick(LINES.qr));
      await hop(28);
      await hop(28);
      await sleep(2400);
      setSay(null);
    };

    // Saltos tipo Geometry Dash: vuelta completa en el aire sobre cada pinche.
    const geometryDash = async () => {
      const start = x < vw() / 2 ? minX() : maxX();
      await move(start, RUN, "run");
      const d = start === minX() ? 1 : -1;
      setDir(d);
      await stand(900, "¡Mirá esto!", { dir: d });
      const to = d === 1 ? Math.min(qrX(), maxX()) : minX() + vw() * 0.1;
      const n = Math.max(2, Math.round(Math.abs(to - x) / JUMP_LEN));
      const len = (to - x) / n;
      setSpikes(Array.from({ length: n }, (_, i) => x + len * (i + 0.5) + W / 2));
      setPose({ mode: "jump", dir: d, lookUp: false });
      await sleep(500);
      for (let i = 0; i < n; i++) {
        await guard(
          Promise.all([
            animate(scope.current, { x: x + len }, { duration: JUMP_S, ease: "linear" }),
            animate(bodyRef.current, { y: [0, -100, 0] }, { duration: JUMP_S, ease: ["easeOut", "easeIn"] }),
            animate(bodyRef.current, { rotate: [0, 360 * d] }, { duration: JUMP_S, ease: "linear" }),
          ])
        );
        x += len;
      }
      setSpikes([]);
      await celebrate(pick(LINES.jump), 1);
    };

    const watchRanking = async () => {
      await move(vw() / 2 - W / 2 + between(-120, 120), RUN, "run");
      await stand(3000, LINES.rank[0], { lookUp: true });
      await stand(2200, pick(LINES.rank.slice(1)), { lookUp: true, dir: -dir });
      dir = -dir;
    };

    const nap = async () => {
      await move(between(minX(), maxX()), WALK, "walk");
      setPose((p) => ({ ...p, mode: "sleep" }));
      setFx("zzz");
      await sleep(between(3500, 5000));
      setFx(null);
      setSay("¡!");
      await hop(50);
      setSay(null);
      await stand(1200, "Uh, ¿me dormí en el stand? 😅");
    };

    const dance = async () => {
      await move(between(minX(), maxX()), WALK, "walk");
      setFx("notes");
      setSay(pick(LINES.dance));
      for (let i = 0; i < 6; i++) {
        setPose({ mode: "cheer", dir: i % 2 ? -1 : 1, lookUp: false });
        await hop(i % 3 === 2 ? 40 : 18);
      }
      dir = 1;
      setFx(null);
      setSay(null);
    };

    const code = async () => {
      await move(between(minX(), maxX() - 60), WALK, "walk");
      setDir(1);
      setFx("laptop");
      setPose({ mode: "type", dir: 1, lookUp: false });
      setSay(LINES.code[0]);
      await sleep(2600);
      setSay(pick(LINES.code.slice(1)));
      await sleep(1800);
      setSay(null);
      setFx(null);
      await celebrate("¡Listo, en producción!", 1);
    };

    const chaseBug = async () => {
      const d = x < vw() / 2 ? 1 : -1;
      const bugStart = x + W / 2 + d * 200;
      const bugEnd = Math.max(minX() + W, Math.min(maxX(), bugStart + d * 420));
      await animate(bugRef.current, { x: bugStart, opacity: 1 }, { duration: 0 });
      setDir(d);
      await stand(900, "¿Un bug? 🐛", { dir: d });
      await guard(
        Promise.all([
          animate(bugRef.current, { x: bugEnd }, { duration: 1.4, ease: "easeInOut" }),
          move(bugEnd - W / 2, 380, "run"),
        ])
      );
      await guard(animate(bugRef.current, { opacity: 0, scale: [1, 1.6, 0] }, { duration: 0.3 }));
      await celebrate(pick(LINES.bug), 2);
    };

    const buildTower = async () => {
      await move(between(minX(), maxX() - 80), WALK, "walk");
      setDir(1);
      const bx = x + W + 12;
      for (let i = 0; i < 3; i++) {
        setBlocks((b) => [...b, { x: bx, i }]);
        setPose({ mode: "idle", dir: 1, lookUp: true });
        await sleep(700);
      }
      await celebrate(pick(LINES.build), 2);
      setBlocks([]);
    };

    const hello = async () => {
      await move(between(minX(), maxX()), WALK, "walk");
      await celebrate(pick(LINES.hello), 3);
    };

    const crossScreen = async () => {
      // Sale por un costado y entra por el otro.
      const exitRight = x > vw() / 2;
      await move(exitRight ? vw() + 40 : -W - 40, RUN, "run");
      x = exitRight ? -W - 40 : vw() + 40;
      await guard(animate(scope.current, { x }, { duration: 0 }));
      await sleep(800);
      await move(between(minX(), maxX()), WALK, "walk");
    };

    // Deja la escena limpia si una acción se cortó a la mitad.
    const resetScene = async () => {
      setSay(null);
      setFx(null);
      setSpikes([]);
      setBlocks([]);
      x = new DOMMatrix(getComputedStyle(scope.current).transform).m41;
      await Promise.all([
        animate(bugRef.current, { opacity: 0 }, { duration: 0.15 }),
        animate(bodyRef.current, { y: 0, rotate: 0 }, { duration: 0.15 }),
      ]);
    };

    // Va corriendo abajo del ranking a festejar al jugador.
    const celebrateScore = async () => {
      const { name, floors, position } = newsRef.current;
      newsRef.current = null;
      celebrating = true;
      try {
        const player = name.split(" · ")[0];
        setSay("¡Puntaje nuevo! 👀");
        await move(vw() * 0.3 - W / 2, RUN, "run");
        setPose({ mode: "cheer", dir: 1, lookUp: true });
        setFx("confetti");
        setSay(`¡Bien ahí, ${player}! ${floors} ${floors === 1 ? "piso" : "pisos"} 🎉`);
        for (let i = 0; i < 3; i++) await hop(34);
        await sleep(2200);
        if (position === 1) {
          setSay("¡Nuevo líder del ranking! 🏆");
          await hop(50);
          await hop(50);
          await sleep(2000);
        }
        setSay(null);
        setFx(null);
        await stand(2000, "¿Quién lo supera? 👉", { dir: 1 });
      } finally {
        celebrating = false;
        interrupted = armInterrupt();
      }
    };

    const ACTIONS = [geometryDash, watchRanking, nap, dance, code, chaseBug, buildTower, hello, crossScreen];

    const loop = async () => {
      await animate(scope.current, { x }, { duration: 0 });
      await animate(bugRef.current, { opacity: 0 }, { duration: 0 });
      let sinceQr = QR_EVERY;
      let last = null;
      while (alive) {
        try {
          if (newsRef.current) {
            await celebrateScore();
            continue;
          }
          let action;
          if (sinceQr >= QR_EVERY) {
            action = visitQr;
            sinceQr = 0;
          } else {
            do action = pick(ACTIONS);
            while (action === last);
            sinceQr++;
          }
          last = action;
          await action();
          await sleep(between(300, 900));
        } catch (e) {
          if (e !== NEWS) throw e;
          await resetScene();
        }
      }
    };
    loop().catch((e) => {
      if (e !== STOP) throw e;
    });
    return () => {
      alive = false;
    };
  }, [animate, scope, targetRef]);

  return (
    <div className="fixed inset-x-0 bottom-0 h-64 pointer-events-none overflow-hidden z-20" aria-hidden>
      <div className="absolute inset-x-0 bottom-4 border-t-2 border-dashed border-zinc-200" />

      <AnimatePresence>
        {spikes.map((sx, i) => (
          <motion.svg
            key={sx}
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className="absolute bottom-4"
            style={{ left: sx - 14 }}
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            exit={{ y: 30 }}
            transition={{ delay: i * 0.06 }}
          >
            <polygon points="0,28 14,0 28,28" fill={INK} stroke={LIME} strokeWidth="2" />
          </motion.svg>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {blocks.map((b) => (
          <motion.div
            key={b.i}
            className="absolute rounded-md"
            style={{ left: b.x - b.i * 3, bottom: 16 + b.i * 22, width: 56 - b.i * 6, height: 20, backgroundColor: b.i === 0 ? INK : LIME }}
            initial={{ y: -260, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          />
        ))}
      </AnimatePresence>

      <div ref={bugRef} className="absolute left-0 bottom-4 -ml-4 text-3xl" style={{ opacity: 0 }}>
        🐛
      </div>

      <div ref={scope} className="absolute left-0 bottom-4" style={{ width: W }}>
        <AnimatePresence>
          {say && (
            <motion.div
              key={say}
              className="absolute bottom-full left-1/2 mb-4 whitespace-nowrap rounded-2xl border-2 bg-white px-4 py-2 text-lg font-bold shadow-sm"
              style={{ x: "-50%", borderColor: INK }}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              {say}
            </motion.div>
          )}
        </AnimatePresence>
        {!say && <Floaters fx={fx} />}
        {fx === "confetti" && <Confetti />}

        <div ref={bodyRef}>
          <div className="relative" style={{ transform: `scaleX(${pose.dir})` }}>
            {pose.mode === "run" &&
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-0 -left-2 w-4 h-4 rounded-full bg-zinc-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.7, 0], scale: [0.4, 1.4], x: [0, -28], y: [0, -10] }}
                  transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            <AnimatePresence>{fx === "laptop" && <Laptop />}</AnimatePresence>
            <Sprite mode={pose.mode} lookUp={pose.lookUp} blink={blink} />
          </div>
        </div>
      </div>
    </div>
  );
}
