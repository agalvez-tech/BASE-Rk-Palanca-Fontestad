import { sql, protegidoAdmin } from '../_db.js'

// Solo para gestores: todas las acciones de los planes activos de TODO el
// equipo, en una sola lista (en vez de tener que entrar agente por agente).
export default protegidoAdmin(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const acciones = await sql`
    SELECT
      a.id AS agente_id, a.nombre AS agente_nombre, a.avatar_url AS agente_avatar,
      pt.trimestre, pt.anio,
      pa.id, pa.dirigido_a, pa.frecuencia, pa.personalizacion,
      ac.nombre AS accion_nombre, ac.maquina, ac.categoria
    FROM plan_acciones pa
    JOIN planes_trimestrales pt ON pt.id = pa.plan_id
    JOIN agentes a ON a.id = pt.agente_id
    JOIN acciones_catalogo ac ON ac.id = pa.accion_catalogo_id
    WHERE pa.activo = true AND pt.estado = 'activo'
    ORDER BY a.nombre, ac.maquina, ac.nombre
  `
  res.status(200).json(acciones)
})
