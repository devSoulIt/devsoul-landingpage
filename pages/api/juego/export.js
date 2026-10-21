import { timingSafeEqual } from 'crypto'
import { getRedis, keys, dayKey, floorsFromScore } from '../../../lib/juegoServer'

// Descarga en CSV de todos los jugadores con su mejor puntaje del día.
// Uso: /api/juego/export?key=JUEGO_ADMIN_KEY&day=2026-10-20 (day es opcional, por defecto hoy)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const adminKey = process.env.JUEGO_ADMIN_KEY
  const given = String(req.query.key || '')
  if (!adminKey || given.length !== adminKey.length || !timingSafeEqual(Buffer.from(given), Buffer.from(adminKey))) {
    return res.status(401).json({ success: false, message: 'No autorizado' })
  }

  try {
    const day = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.day)) ? String(req.query.day) : dayKey()
    const db = getRedis()
    const ids = await db.smembers(keys.players)
    const [players, scores] = await Promise.all([
      Promise.all(ids.map((id) => db.hgetall(keys.player(id)))),
      Promise.all(ids.map((id) => db.zscore(keys.ranking(day), id))),
    ])

    const rows = ids
      .map((id, i) => ({ ...players[i], floors: scores[i] === null ? '' : floorsFromScore(scores[i]) }))
      .sort((a, b) => (Number(b.floors) || 0) - (Number(a.floors) || 0))

    const header = ['nombre', 'empresa', 'email', 'telefono', `pisos_${day}`, 'registrado']
    const csv = [header, ...rows.map((p) => [p.name, p.company, p.email, p.phone, p.floors, p.createdAt])]
      .map((cols) => cols.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="jugadores-${day}.csv"`)
    return res.status(200).send('﻿' + csv)
  } catch (error) {
    console.log('🚀 ~ juego/export ~ error:', error)
    return res.status(500).json({ success: false, message: 'No se pudo exportar' })
  }
}
