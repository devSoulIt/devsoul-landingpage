// El CV viaja en base64 dentro del JSON: 3 MB de archivo ≈ 4 MB de body.
export const config = {
  api: { bodyParser: { sizeLimit: '4.4mb' } },
}

const MAX_CV_BYTES = 3 * 1024 * 1024

// Firmas de archivo (magic bytes) para no confiar solo en la extensión.
const ALLOWED_TYPES = {
  pdf: (buf) => buf.subarray(0, 4).toString('latin1') === '%PDF',
  docx: (buf) => buf[0] === 0x50 && buf[1] === 0x4b,
  doc: (buf) => buf.subarray(0, 4).toString('hex') === 'd0cf11e0',
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    post(req, res)
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const post = async (req, res) => {
  try {
    const { name, email, phone, link, area, message, cvName, cvBase64, website, source } = req.body || {}

    // Honeypot: los bots completan este campo oculto.
    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!name || !email || !cvName || !cvBase64) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'El email no es válido' });
    }

    const extension = String(cvName).split('.').pop().toLowerCase()
    const isValidType = ALLOWED_TYPES[extension]
    const cvBuffer = Buffer.from(String(cvBase64), 'base64')

    if (!isValidType || !isValidType(cvBuffer)) {
      return res.status(400).json({ success: false, message: 'El CV tiene que ser PDF, DOC o DOCX' });
    }

    if (cvBuffer.length > MAX_CV_BYTES) {
      return res.status(400).json({ success: false, message: 'El CV no puede pesar más de 3 MB' });
    }

    if (!process.env.BREVO_API_KEY) {
      return res.status(500).json({ success: false, message: 'BREVO_API_KEY no configurada' });
    }

    const devsoulEmail = process.env.DEVSOUL_NOTIFICATION_EMAIL || 'devsoul256@gmail.com'
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hello@devsoulit.com'
    const safeFileName = `CV - ${String(name).replace(/[^\p{L}\p{N} _-]/gu, '').trim() || 'postulante'}.${extension}`

    const rows = [
      ['Nombre', name],
      ['Email', email],
      ['Teléfono', phone],
      ['LinkedIn / Portfolio', link],
      ['Área de interés', area],
      ['Mensaje', message],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<p><strong>${label}:</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`)
      .join('')

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: 'DevSoul Web' },
        to: [{ email: devsoulEmail, name: 'DevSoul' }],
        replyTo: { email, name },
        subject: `${source === 'juego' ? '[Evento] ' : ''}Nueva postulación: ${name}${area ? ` — ${area}` : ''}`,
        htmlContent: `<h2>Nueva postulación desde ${source === 'juego' ? 'el juego del evento' : 'la web'}</h2>${rows}<p>El CV está adjunto.</p>`,
        attachment: [{ name: safeFileName, content: cvBuffer.toString('base64') }]
      })
    });

    if (!response.ok) {
      const brevoError = await response.text()
      return res.status(502).json({
        success: false,
        message: `Brevo rechazó el envío de la postulación: ${brevoError}`
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log("🚀 ~ postulacion ~ error:", error)
    return res.status(500).json({ success: false, message: 'Error al procesar la postulación' });
  }
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
