import { OAuth2Client } from 'google-auth-library'
import { sql, conManejoErrores } from '../_db.js'
import { crearSesionToken, cookieSesion } from '../_auth.js'

const DOMINIO_PERMITIDO = 'inmobiliariapalanca.com'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// El frontend manda el "credential" (id_token) que entrega Google Identity
// Services tras el login. Aquí se verifica la firma con Google, se
// comprueba que es una cuenta @inmobiliariapalanca.com verificada, y se
// crea (o actualiza) el perfil del agente automáticamente en el primer
// login — no hace falta alta manual.
export default conManejoErrores(async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Falta configurar GOOGLE_CLIENT_ID en el servidor' })
  }

  const { credential } = req.body ?? {}
  if (!credential) return res.status(400).json({ error: 'Falta credential' })

  let payload
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })
    payload = ticket.getPayload()
  } catch {
    return res.status(401).json({ error: 'Token de Google inválido' })
  }

  const email = payload?.email?.toLowerCase()
  if (!payload?.email_verified || !email?.endsWith(`@${DOMINIO_PERMITIDO}`)) {
    return res.status(403).json({ error: `Solo se permiten cuentas @${DOMINIO_PERMITIDO}` })
  }

  const [agente] = await sql`
    INSERT INTO agentes (nombre, email, avatar_url)
    VALUES (${payload.name ?? email}, ${email}, ${payload.picture ?? null})
    ON CONFLICT (email) DO UPDATE SET nombre = EXCLUDED.nombre, avatar_url = EXCLUDED.avatar_url
    RETURNING id, nombre, email, avatar_url
  `

  const token = await crearSesionToken(agente)
  res.setHeader('Set-Cookie', cookieSesion(token))
  res.status(200).json(agente)
})
