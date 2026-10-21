import { dayKey, getRanking } from '../../../lib/juegoServer'

// Ranking público del día (lo usa la pantalla del stand y la pantalla de resultado).
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const day = dayKey()
    const ranking = await getRanking(day, 10)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ success: true, day, ranking: ranking.map(({ playerId, ...row }) => row) })
  } catch (error) {
    console.log('🚀 ~ juego/ranking ~ error:', error)
    return res.status(500).json({ success: false, message: 'No se pudo cargar el ranking' })
  }
}
