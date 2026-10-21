// Lógica de "Construí tu sistema", compartida entre el navegador y el servidor.
// El cliente solo manda los instantes en que tocó la pantalla; el servidor vuelve a
// simular la partida con estas mismas funciones y calcula el puntaje real, así nadie
// puede mandar un puntaje inventado.

export const WIDTH = 300; // ancho del área de juego, en unidades lógicas
export const BLOCK_HEIGHT = 26;
export const BASE_WIDTH = 190;
export const PERFECT_TOLERANCE = 4; // a menos de esto se cuenta como encaje perfecto
export const MIN_TAP_GAP = 60; // ms; más rápido que esto no es humano
export const MAX_TAPS = 400;

export const LAYERS = [
  "Base de datos",
  "Backend",
  "API",
  "Login",
  "Panel admin",
  "Reportes",
  "Integraciones",
  "Pagos",
  "App mobile",
  "Notificaciones",
  "Automatización",
  "IA",
];

export const layerName = (level) => LAYERS[(level - 1) % LAYERS.length];

// Velocidad en unidades por ms: arranca tranquila y acelera con cada piso.
export const speedFor = (level) => Math.min(0.14 + level * 0.009, 0.42);

const range = (width) => ({ min: -width / 2, max: WIDTH - width / 2 });

export function initialState() {
  return {
    blocks: [{ x: (WIDTH - BASE_WIDTH) / 2, width: BASE_WIDTH, perfect: false }],
    levelStart: 0, // instante (ms) en que empezó a moverse el bloque actual
    over: false,
    perfects: 0,
  };
}

// Posición x del bloque que se está moviendo en el instante t (ms desde el inicio).
export function movingX(state, t) {
  const level = state.blocks.length;
  const { width } = state.blocks[level - 1];
  const { min, max } = range(width);
  const span = max - min;
  const traveled = (speedFor(level) * Math.max(0, t - state.levelStart)) % (2 * span);
  const offset = traveled < span ? traveled : 2 * span - traveled;
  // Los pisos pares arrancan desde la derecha para variar.
  return level % 2 === 1 ? min + offset : max - offset;
}

// Aplica un toque en el instante t. Devuelve el estado nuevo (no muta el anterior).
export function place(state, t) {
  if (state.over) return state;
  const prev = state.blocks[state.blocks.length - 1];
  const x = movingX(state, t);

  if (Math.abs(x - prev.x) <= PERFECT_TOLERANCE) {
    return {
      ...state,
      blocks: [...state.blocks, { x: prev.x, width: prev.width, perfect: true }],
      levelStart: t,
      perfects: state.perfects + 1,
    };
  }

  const left = Math.max(x, prev.x);
  const right = Math.min(x + prev.width, prev.x + prev.width);
  if (right - left <= 0) {
    return { ...state, over: true, missX: x };
  }
  return {
    ...state,
    blocks: [...state.blocks, { x: left, width: right - left, perfect: false }],
    levelStart: t,
  };
}

// Pisos construidos (sin contar la base).
export const floorsOf = (state) => state.blocks.length - 1;

// Repite una partida completa a partir de los toques. Devuelve null si los datos
// no son válidos.
export function replay(taps) {
  if (!Array.isArray(taps) || taps.length > MAX_TAPS) return null;
  let state = initialState();
  let last = 0;
  for (const t of taps) {
    if (!Number.isFinite(t) || t < last + MIN_TAP_GAP) return null;
    last = t;
    state = place(state, t);
    if (state.over) break;
  }
  return { floors: floorsOf(state), perfects: state.perfects, over: state.over };
}
