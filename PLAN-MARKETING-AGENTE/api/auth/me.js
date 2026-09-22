import { sql, conManejoErrores } from '../_db.js'
import { leerSesion } from '../_auth.js'

export default conManejoErrores(async function handler(req, res) {
  const sesion = await leerSesion(req)
  if (!sesion) return res.status(401).json({ error: 'No autenticado' })

  const [agente] = await sql`
    SELECT id, nombre, email, avatar_url FROM agentes WHERE id = ${sesion.id}
  `
  if (!agente) return res.status(401).json({ error: 'No autenticado' })
  res.status(200).json(agente)
})
