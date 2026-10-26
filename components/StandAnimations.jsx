import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaFileExcel,
  FaGlobe,
  FaMobileAlt,
  FaRobot,
  FaCheckCircle,
  FaSearch,
  FaFileSignature,
  FaLaptopCode,
  FaRocket,
} from "react-icons/fa";
import { LAYERS } from "../lib/stackGame";

const PRIMARY = "#BDF61D";
const ACCENT = "#4D7C0F";
const INK = "#18181B";

// Animaciones que se intercalan con el QR en la pantalla del stand.
// Cada una arranca su propia línea de tiempo al montarse y dura ~ANIMATION_MS.
export const ANIMATION_MS = 11000;

function Caption({ title, text }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-black mb-2">{title}</p>
      <p className="text-lg text-zinc-600">{text}</p>
    </div>
  );
}

function Frame({ children, title, text }) {
  return (
    <div className="h-full flex flex-col justify-between gap-6">
      <div className="flex-1 flex items-center justify-center">{children}</div>
      <Caption title={title} text={text} />
    </div>
  );
}

// 1. Se escribe el código y la app aparece funcionando.
const CODE = [
  ["const ", "pedido", " = await crearPedido({"],
  ["  cliente: ", '"Ferretería Sur"', ","],
  ["  items: ", "carrito", ","],
  ["});"],
  ["await ", "stock", ".descontar(pedido.items);"],
  ["await ", "whatsapp", ".avisar(pedido.cliente);"],
];
const LINE_DELAY = 0.7;

function CodeToApp() {
  const appAt = CODE.length * LINE_DELAY + 0.4;
  return (
    <Frame title="Escribimos tu sistema" text="Código a medida para cómo trabaja tu empresa">
      <div className="w-full space-y-4">
        <div className="rounded-2xl p-5 text-left font-mono text-[15px] leading-7 shadow-sm" style={{ backgroundColor: INK }}>
          <div className="flex gap-1.5 mb-3">
            {["#F87171", "#FBBF24", PRIMARY].map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          {CODE.map(([a, b = "", c = ""], i) => (
            <motion.div
              key={i}
              className="whitespace-pre text-zinc-300"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.3 + i * LINE_DELAY, duration: 0.6, ease: "linear" }}
            >
              <span className="text-zinc-500">{a}</span>
              <span style={{ color: PRIMARY }}>{b}</span>
              {c}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: appAt, type: "spring", stiffness: 160, damping: 18 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FaCheckCircle className="text-2xl" style={{ color: ACCENT }} />
            <p className="font-bold text-lg">Pedido #1042 creado</p>
          </div>
          {[
            ["Stock actualizado", 0.72],
            ["Cliente avisado por WhatsApp", 1],
          ].map(([label, w], i) => (
            <div key={label} className="mb-2 last:mb-0">
              <p className="text-sm text-zinc-500 mb-1">{label}</p>
              <div className="h-2.5 rounded-full bg-zinc-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: PRIMARY, transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: w }}
                  transition={{ delay: appAt + 0.4 + i * 0.5, duration: 0.9, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Frame>
  );
}

// 2. Una planilla desordenada se convierte en un tablero.
const COLS = 5;
const ROWS = 6;
const SWAP_AT = 4.2;
const BARS = [0.45, 0.6, 0.5, 0.8, 0.7, 0.95];

function SheetToDashboard() {
  return (
    <Frame title="De la planilla al sistema" text="Dejá de pasar datos a mano: tus números, al día y en un lugar">
      <div className="relative w-full aspect-square">
        <motion.div
          className="absolute inset-0 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, scale: 0.85 }}
          transition={{ delay: SWAP_AT, duration: 0.5 }}
        >
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const bad = [3, 8, 14, 21, 27].includes(i);
            return (
              <motion.div
                key={i}
                className="rounded-md border flex items-center justify-center text-sm font-semibold"
                style={{
                  borderColor: bad ? "#FCA5A5" : "#E4E4E7",
                  backgroundColor: bad ? "#FEF2F2" : "#FFFFFF",
                  color: bad ? "#DC2626" : "#A1A1AA",
                }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: bad ? [0, -4, 4, 0] : 0 }}
                transition={{ delay: ((i * 7) % 30) * 0.08, duration: 0.4, rotate: { delay: 2.6, duration: 0.5, repeat: 2 } }}
              >
                {bad ? "#REF!" : i % 3 === 0 ? "$" + (i * 137) % 900 : ""}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-2xl border border-zinc-200 bg-white p-5 flex flex-col"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: SWAP_AT + 0.4, type: "spring", stiffness: 140, damping: 18 }}
        >
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ["Ventas del mes", "$4,2M"],
              ["Pedidos hoy", "128"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: "rgba(189,246,29,0.2)" }}>
                <p className="text-sm text-zinc-600">{label}</p>
                <p className="text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-end gap-3">
            {BARS.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-lg"
                style={{ height: `${h * 100}%`, backgroundColor: i === BARS.length - 1 ? ACCENT : PRIMARY, transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: SWAP_AT + 0.9 + i * 0.15, duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </Frame>
  );
}

// 3. Integraciones: todo conectado a un sistema central.
const NODES = [
  { Icon: FaWhatsapp, label: "WhatsApp", color: "#25D366" },
  { Icon: FaFileExcel, label: "Excel", color: "#107C41" },
  { Icon: FaGlobe, label: "Web", color: INK },
  { Icon: FaMobileAlt, label: "App", color: INK },
  { Icon: FaRobot, label: "IA", color: ACCENT },
];
const C = 200;
const R = 145;
const nodePos = (i) => {
  const a = (-90 + (360 / NODES.length) * i) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
};

function Integrations() {
  return (
    <Frame title="Conectamos todo" text="Integramos lo que ya usás y automatizamos con IA">
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
          {NODES.map((_, i) => {
            const { x, y } = nodePos(i);
            return (
              <g key={i}>
                <motion.line
                  x1={C}
                  y1={C}
                  x2={x}
                  y2={y}
                  stroke="#D4D4D8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8 + i * 0.25, duration: 0.6 }}
                />
                <motion.circle
                  r="7"
                  fill={PRIMARY}
                  stroke={ACCENT}
                  strokeWidth="2"
                  initial={{ cx: x, cy: y, opacity: 0 }}
                  animate={{ cx: [x, C], cy: [y, C], opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 2.6 + i * 0.35, duration: 1.1, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
                />
              </g>
            );
          })}
        </svg>

        {NODES.map(({ Icon, label, color }, i) => {
          const { x, y } = nodePos(i);
          return (
            <motion.div
              key={label}
              className="absolute flex flex-col items-center"
              // El centrado va en style: framer-motion pisa los translate de Tailwind.
              style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%`, x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.25, type: "spring", stiffness: 220, damping: 14 }}
            >
              <span className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
                <Icon className="text-3xl" style={{ color }} />
              </span>
              <span className="mt-1 text-sm font-semibold text-zinc-600">{label}</span>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute left-1/2 top-1/2 w-28 h-28 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: INK, x: "-50%", y: "-50%" }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 1, 1.08, 1] }}
          transition={{ duration: 3.4, times: [0, 0.15, 0.75, 0.85, 1] }}
        >
          <img src="/img/logos/isotipo 1.png" alt="" className="w-16 h-16 object-cover" />
        </motion.div>
      </div>
    </Frame>
  );
}

// 4. La torre del juego se arma sola: invita a escanear el QR.
const STACK = LAYERS.slice(0, 6);
const BLOCK_DELAY = 0.9;

function BuildTower() {
  return (
    <Frame title="¿Cuántos pisos llegás?" text="Escaneá el QR que viene y construí tu sistema">
      <div className="w-full aspect-square flex flex-col-reverse items-center justify-start pb-2">
        <div className="w-[85%] h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: INK }}>
          Tu empresa
        </div>
        {STACK.map((label, i) => (
          <motion.div
            key={label}
            className="h-14 rounded-lg flex items-center justify-center font-bold text-lg mb-0.5"
            style={{ width: `${82 - i * 5}%`, backgroundColor: ["#BDF61D", "#A8E00F", "#93C90C", "#7EB10A", "#699908", "#93C90C"][i], color: "#080808" }}
            initial={{ x: i % 2 ? 320 : -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + i * BLOCK_DELAY, type: "spring", stiffness: 260, damping: 22 }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

// 5. Las etapas de trabajo, las mismas de la landing.
const STEPS = [
  { Icon: FaSearch, title: "Diagnóstico", text: "Entendemos tu operación" },
  { Icon: FaFileSignature, title: "Propuesta clara", text: "Alcance y precio por escrito" },
  { Icon: FaLaptopCode, title: "Desarrollo con demos", text: "Avances reales cada semana" },
  { Icon: FaRocket, title: "Lanzamiento y soporte", text: "Te seguimos acompañando" },
];
const STEP_DELAY = 1.8;

function Process() {
  return (
    <Frame title="Cómo trabajamos" text="Sabés qué pasa en cada etapa, sin sorpresas">
      <div className="relative w-full text-left pl-2">
        <div className="absolute left-[34px] top-8 bottom-8 w-1 rounded-full bg-zinc-100">
          <motion.div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: PRIMARY, transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.6, duration: STEP_DELAY * (STEPS.length - 1), ease: "linear" }}
          />
        </div>
        <div className="space-y-6">
          {STEPS.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              className="relative flex items-center gap-5"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * STEP_DELAY, duration: 0.4 }}
            >
              <motion.span
                className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                initial={{ backgroundColor: "#F4F4F5", color: "#A1A1AA", scale: 1 }}
                animate={{ backgroundColor: PRIMARY, color: "#080808", scale: [1, 1.15, 1] }}
                transition={{ delay: 0.6 + i * STEP_DELAY, duration: 0.5 }}
              >
                <Icon />
              </motion.span>
              <div>
                <p className="text-xl font-bold">{title}</p>
                <p className="text-zinc-500">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

// 6. Un cliente escribe por WhatsApp y la IA le responde y carga el pedido.
const CHAT = [
  { from: "client", text: "Hola! ¿Tienen el taladro Bosch en stock?" },
  { from: "bot", text: "¡Hola! Sí, nos quedan 4. ¿Te reservo uno?" },
  { from: "client", text: "Dale, lo paso a buscar mañana" },
  { from: "bot", text: "Listo ✅ Reservado a tu nombre. Pedido #1043" },
];
const MSG_DELAY = 2;

function WhatsAppBot() {
  return (
    <Frame title="Tu WhatsApp responde solo" text="Una IA que atiende, consulta el stock y carga pedidos 24/7">
      <div className="w-full rounded-3xl overflow-hidden border border-zinc-200 shadow-sm text-left">
        <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: "#075E54" }}>
          <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: INK }}>
            <img src="/img/logos/isotipo 1.png" alt="" className="w-6 h-6 object-cover" />
          </span>
          <div>
            <p className="font-bold leading-tight">Ferretería Sur</p>
            <p className="text-xs text-white/70">en línea</p>
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[360px]" style={{ backgroundColor: "#ECE5DD" }}>
          {CHAT.map((m, i) => {
            const at = 0.5 + i * MSG_DELAY;
            const bot = m.from === "bot";
            return (
              <div key={i} className={`relative flex ${bot ? "justify-start" : "justify-end"}`}>
                {bot && (
                  <motion.span
                    className="absolute rounded-2xl bg-white px-4 py-3 flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ delay: at - 1, duration: 1, times: [0, 0.1, 0.9, 1] }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-2 h-2 rounded-full bg-zinc-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: d * 0.12 }}
                      />
                    ))}
                  </motion.span>
                )}
                <motion.p
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[17px] shadow-sm"
                  style={{ backgroundColor: bot ? "#FFFFFF" : "#DCF8C6" }}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: at, type: "spring", stiffness: 260, damping: 20 }}
                >
                  {m.text}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

export const ANIMATIONS = [CodeToApp, SheetToDashboard, Integrations, BuildTower, Process, WhatsAppBot];
