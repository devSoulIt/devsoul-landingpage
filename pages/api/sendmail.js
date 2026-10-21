export default function handler(req, res) {
  if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const post = async (req, res) => {
  try {
    const { email, name, company, phone, projectType, budget, timeline, message } = req.body

    if (!email || !name || !message) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({ success: false, message: 'BREVO_API_KEY no configurada' });
    }

    const apiUrl = 'https://api.brevo.com/v3'
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }

    const normalizedPhone = normalizePhone(phone)

    // Crea o actualiza el contacto y lo agrega a la lista con ID 7.
    const addToListResponse = await fetch(`${apiUrl}/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          COMPANY: company || '',
          ...(normalizedPhone ? { SMS: normalizedPhone } : {}),
          PROJECT_TYPE: projectType || '',
          BUDGET: budget || '',
          TIMELINE: timeline || '',
          MESSAGE: message
        },
        listIds: [7],
        updateEnabled: true
      })
    })

    if (!addToListResponse.ok) {
      const brevoError = await addToListResponse.text()
      return res.status(502).json({
        success: false,
        message: `Brevo rechazó el alta en lista: ${brevoError}`
      });
    }

    const confirmationResponse = await fetch(`${apiUrl}/smtp/email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: [{ email, name }],
        templateId: 4,
        params: {
          nombre: name
        }
      })
    });

    if (!confirmationResponse.ok) {
      const brevoError = await confirmationResponse.text()
      return res.status(502).json({
        success: false,
        message: `Brevo rechazó el envío de confirmación: ${brevoError}`
      });
    }

    const devsoulEmail = process.env.DEVSOUL_NOTIFICATION_EMAIL || 'devsoul256@gmail.com'
    const internalNotificationResponse = await fetch(`${apiUrl}/smtp/email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: [{ email: devsoulEmail, name: 'DevSoul' }],
        replyTo: { email, name },
        templateId: 5,
        params: {
          nombre: name,
          email,
          telefono: phone || '',
          empresa: company || '',
          mensaje: message
        }
      })
    });

    if (!internalNotificationResponse.ok) {
      const brevoError = await internalNotificationResponse.text()
      return res.status(502).json({
        success: false,
        message: `Brevo rechazó la notificación interna: ${brevoError}`
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log("🚀 ~ post ~ error:", error)
    return res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
  }

}

const normalizePhone = (rawPhone) => {
  if (!rawPhone) return null

  const trimmed = String(rawPhone).trim()
  if (!trimmed) return null

  let normalized = trimmed.replace(/[^\d+]/g, '')
  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`
  }

  // Formato internacional E.164: +[código][número], 8 a 15 dígitos.
  const isValidE164 = /^\+[1-9]\d{7,14}$/.test(normalized)
  return isValidE164 ? normalized : null
}
