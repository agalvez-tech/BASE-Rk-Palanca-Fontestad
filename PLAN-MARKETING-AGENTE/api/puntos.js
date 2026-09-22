import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res, agenteId) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const [{ total }] = await sql`
    SELECT coalesce(sum(puntos), 0)::int AS total FROM puntos_historial
    WHERE agente_id = ${agenteId} AND fecha >= date_trunc('month', CURRENT_DATE)
  `
  const [{ objetivo_puntos_mensual }] = await sql`
    SELECT objetivo_puntos_mensual FROM agentes WHERE id = ${agenteId}
  `

  res.status(200).json({ puntos_mes: total, objetivo_puntos_mensual })
})
