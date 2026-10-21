import { getRedis, isRateLimited, clientIp, keys, newId, isValidEmail, clean } from '../../../lib/juegoServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const name = clean(req.body?.name)
    const company = clean(req.body?.company)
    const email = clean(req.body?.email, 120).toLowerCase()
    const phone = clean(req.body?.phone, 30)

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Completá tu nombre y tu email' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'El email no es válido' })
    }
    if (await isRateLimited('registro', clientIp(req), 150, 600)) {
      return res.status(429).json({ success: false, message: 'Demasiados intentos, esperá unos minutos' })
    }

    const db = getRedis()
    // Mismo email = mismo jugador: así nadie se registra varias veces para ocupar el ranking.
    const existingId = await db.get(keys.playerByEmail(email))
    const playerId = existingId || newId()

    await db.hset(keys.player(playerId), {
      name,
      company,
      email,
      phone,
      ...(existingId ? {} : { createdAt: new Date().toISOString() }),
    })
    if (!existingId) {
      await db.set(keys.playerByEmail(email), playerId)
      await db.sadd(keys.players, playerId)
      await addToBrevo({ name, company, email, phone })
    }

    return res.status(200).json({ success: true, playerId, name })
  } catch (error) {
    console.log('🚀 ~ juego/registro ~ error:', error)
    return res.status(500).json({ success: false, message: 'Error al registrarte' })
  }
}

// Suma el jugador a la lista de contactos de Brevo (sin mandarle mails). Si falla, no
// bloquea el juego: el jugador igual queda guardado y se puede exportar.
async function addToBrevo({ name, company, email, phone }) {
  if (!process.env.BREVO_API_KEY) return
  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          COMPANY: company,
          MESSAGE: `[Juego] ${phone ? `Tel: ${phone}` : ''}`.trim()
        },
        listIds: [7],
        updateEnabled: true
      })
    })
  } catch (error) {
    console.log('🚀 ~ juego/registro ~ brevo error:', error)
  }
}
