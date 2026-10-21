import { randomUUID } from 'crypto'
import { Redis } from '@upstash/redis'

// Inicialización diferida: así `next build` no falla si todavía no hay variables.
let redis = null
export function getRedis() {
  if (!redis) redis = Redis.fromEnv()
  return redis
}

export const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown'

// Límite de intentos con ventana fija (INCR + EXPIRE). En el evento mucha gente
// comparte el WiFi (misma IP), así que los límites por IP tienen que ser generosos.
export async function isRateLimited(action, identifier, max, windowSeconds) {
  const key = `juego:rl:${action}:${identifier}`
  const db = getRedis()
  const count = await db.incr(key)
  if (count === 1) await db.expire(key, windowSeconds)
  return count > max
}

// El ranking se reinicia cada día, en horario de Argentina.
export const dayKey = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(date)

export const keys = {
  player: (id) => `juego:player:${id}`,
  playerByEmail: (email) => `juego:email:${email}`,
  players: 'juego:players',
  session: (id) => `juego:session:${id}`,
  ranking: (day) => `juego:ranking:${day}`,
}

export const newId = () => randomUUID()

// En el ranking público no mostramos el email: "Ana P. · Empresa".
export function publicName(player) {
  if (!player) return 'Jugador'
  const [first = '', last = ''] = String(player.name).trim().split(/\s+/)
  const name = last ? `${first} ${last[0].toUpperCase()}.` : first
  return player.company ? `${name} · ${player.company}` : name
}

// El puntaje del ranking combina pisos y momento: a igual altura, gana quien llegó primero.
export const rankingScore = (floors, achievedAt) => floors + (1 - achievedAt / 1e13)
export const floorsFromScore = (score) => Math.floor(Number(score))

export async function getRanking(day, limit = 10) {
  const db = getRedis()
  const entries = await db.zrange(keys.ranking(day), 0, limit - 1, { rev: true, withScores: true })
  const rows = []
  for (let i = 0; i < entries.length; i += 2) {
    rows.push({ playerId: entries[i], floors: floorsFromScore(entries[i + 1]) })
  }
  const players = await Promise.all(rows.map((r) => db.hgetall(keys.player(r.playerId))))
  return rows.map((r, i) => ({ position: i + 1, name: publicName(players[i]), floors: r.floors, playerId: r.playerId }))
}

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const clean = (value, max = 80) => String(value || '').trim().slice(0, max)
