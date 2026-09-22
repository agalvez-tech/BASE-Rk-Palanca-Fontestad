import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res, agenteId) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const automatizaciones = await sql`
    SELECT id, nombre, evento_disparador FROM automatizaciones
    WHERE activo = true AND (agente_id = ${agenteId} OR agente_id IS NULL)
    ORDER BY nombre
  `
  if (automatizaciones.length === 0) return res.status(200).json([])

  const ids = automatizaciones.map((a) => a.id)
  const tareas = await sql`
    SELECT id, automatizacion_id, titulo, descripcion, offset_dias FROM automatizacion_tareas
    WHERE automatizacion_id = ANY(${ids}::uuid[]) ORDER BY offset_dias
  `

  const resultado = automatizaciones.map((a) => ({
    ...a,
    tareas: tareas.filter((t) => t.automatizacion_id === a.id),
  }))
  res.status(200).json(resultado)
})
