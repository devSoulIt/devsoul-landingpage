import { replay } from '../../../lib/stackGame'
import { getRedis, keys, dayKey, rankingScore, floorsFromScore, getRanking } from '../../../lib/juegoServer'

// Margen para diferencias de reloj y latencia entre el celular y el servidor.
const CLOCK_TOLERANCE_MS = 1500

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const sessionId = String(req.body?.sessionId || '')
    const taps = req.body?.taps
    const db = getRedis()

    // getdel: cada partida se puede cerrar una sola vez.
    const session = sessionId ? await db.getdel(keys.session(sessionId)) : null
    if (!session) {
      return res.status(400).json({ success: false, message: 'La partida no existe o ya terminó' })
    }

    const result = replay(taps)
    if (!result) {
      return res.status(400).json({ success: false, message: 'Partida inválida' })
    }

    // Los toques no pueden ser posteriores al tiempo real que pasó desde que empezó.
    const elapsed = Date.now() - session.startedAt
    const lastTap = taps.length ? taps[taps.length - 1] : 0
    if (lastTap > elapsed + CLOCK_TOLERANCE_MS) {
      return res.status(400).json({ success: false, message: 'Partida inválida' })
    }

    const day = dayKey()
    const rankingKey = keys.ranking(day)
    if (result.floors > 0) {
      // gt: solo se guarda si supera el mejor puntaje del jugador en el día.
      await db.zadd(rankingKey, { gt: true }, { score: rankingScore(result.floors, Date.now()), member: session.playerId })
    }

    const [best, rank, top] = await Promise.all([
      db.zscore(rankingKey, session.playerId),
      db.zrevrank(rankingKey, session.playerId),
      getRanking(day),
    ])

    return res.status(200).json({
      success: true,
      floors: result.floors,
      perfects: result.perfects,
      best: best === null ? 0 : floorsFromScore(best),
      position: rank === null ? null : rank + 1,
      ranking: top.map(({ playerId, ...row }) => ({ ...row, me: playerId === session.playerId })),
    })
  } catch (error) {
    console.log('🚀 ~ juego/finish ~ error:', error)
    return res.status(500).json({ success: false, message: 'No se pudo guardar la partida' })
  }
}
