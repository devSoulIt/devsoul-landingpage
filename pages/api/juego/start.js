import { getRedis, isRateLimited, keys, newId } from '../../../lib/juegoServer'

// Abre una partida. El servidor anota cuándo empezó para después verificar que los
// toques que manda el celular sean posibles en el tiempo que pasó de verdad.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const playerId = String(req.body?.playerId || '')
    const db = getRedis()

    if (!playerId || !(await db.exists(keys.player(playerId)))) {
      return res.status(401).json({ success: false, message: 'Registrate para jugar' })
    }
    if (await isRateLimited('start', playerId, 60, 600)) {
      return res.status(429).json({ success: false, message: 'Muchas partidas seguidas, esperá un ratito' })
    }

    const sessionId = newId()
    await db.set(keys.session(sessionId), { playerId, startedAt: Date.now() }, { ex: 60 * 20 })

    return res.status(200).json({ success: true, sessionId })
  } catch (error) {
    console.log('🚀 ~ juego/start ~ error:', error)
    return res.status(500).json({ success: false, message: 'No se pudo iniciar la partida' })
  }
}
