import { sql, protegido } from './_db.js'

async function planActivo(agenteId) {
  const [plan] = await sql`
    SELECT id, trimestre, anio FROM planes_trimestrales
    WHERE agente_id = ${agenteId} AND estado = 'activo'
    ORDER BY anio DESC, trimestre DESC LIMIT 1
  `
  return plan
}

export default protegido(async function handler(req, res, agenteId) {
  if (req.method === 'GET') {
    const plan = await planActivo(agenteId)
    if (!plan) {
      // Sin plan todavía: se devuelve un objeto vacío (no null) para que el
      // frontend lo distinga de "no hay respuesta" y no se quede con los
      // datos de ejemplo.
      const hoy = new Date()
      return res.status(200).json({
        id: null,
        trimestre: Math.floor(hoy.getMonth() / 3) + 1,
        anio: hoy.getFullYear(),
        acciones: [],
      })
    }
    const acciones = await sql`
      SELECT pa.id, pa.accion_catalogo_id, pa.dirigido_a, pa.frecuencia, pa.personalizacion,
             ac.nombre AS accion_nombre, ac.maquina, ac.codigo
      FROM plan_acciones pa JOIN acciones_catalogo ac ON ac.id = pa.accion_catalogo_id
      WHERE pa.plan_id = ${plan.id} AND pa.activo = true
      ORDER BY pa.id
    `
    return res.status(200).json({ ...plan, acciones })
  }

  if (req.method === 'POST') {
    const { accion_catalogo_id, dirigido_a, frecuencia, personalizacion } = req.body ?? {}
    if (!accion_catalogo_id || !dirigido_a || !frecuencia) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    let plan = await planActivo(agenteId)
    if (!plan) {
      const hoy = new Date()
      const trimestre = Math.floor(hoy.getMonth() / 3) + 1
      ;[plan] = await sql`
        INSERT INTO planes_trimestrales (agente_id, trimestre, anio)
        VALUES (${agenteId}, ${trimestre}, ${hoy.getFullYear()})
        RETURNING id, trimestre, anio
      `
    }

    const [{ total }] = await sql`
      SELECT count(*)::int AS total FROM plan_acciones WHERE plan_id = ${plan.id} AND activo = true
    `
    if (total >= 4) return res.status(400).json({ error: 'Ya hay 4 acciones en el plan (máximo permitido)' })

    const [accion] = await sql`
      INSERT INTO plan_acciones (plan_id, accion_catalogo_id, dirigido_a, frecuencia, personalizacion)
      VALUES (${plan.id}, ${accion_catalogo_id}, ${dirigido_a}, ${frecuencia}, ${personalizacion ?? null})
      RETURNING id
    `
    return res.status(201).json(accion)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Falta id' })
    const [borrado] = await sql`
      UPDATE plan_acciones SET activo = false
      WHERE id = ${id} AND plan_id IN (SELECT id FROM planes_trimestrales WHERE agente_id = ${agenteId})
      RETURNING id
    `
    if (!borrado) return res.status(404).json({ error: 'Acción no encontrada' })
    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).end()
})
