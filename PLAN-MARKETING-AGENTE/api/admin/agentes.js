import { sql, protegidoAdmin } from '../_db.js'

// Solo para administradores: lista todos los agentes con un resumen de
// su plan trimestral activo (si lo tienen), para poder ver de un
// vistazo quién ha planificado y quién no.
export default protegidoAdmin(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const agentes = await sql`
    SELECT
      a.id, a.nombre, a.email, a.avatar_url, a.es_admin,
      pt.trimestre, pt.anio,
      (
        SELECT count(*)::int FROM plan_acciones pa
        WHERE pa.plan_id = pt.id AND pa.activo = true
      ) AS total_acciones
    FROM agentes a
    LEFT JOIN LATERAL (
      SELECT id, trimestre, anio FROM planes_trimestrales
      WHERE agente_id = a.id AND estado = 'activo'
      ORDER BY anio DESC, trimestre DESC LIMIT 1
    ) pt ON true
    ORDER BY a.nombre
  `
  res.status(200).json(agentes)
})
