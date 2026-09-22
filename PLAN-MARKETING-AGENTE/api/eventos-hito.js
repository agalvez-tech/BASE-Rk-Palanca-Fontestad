import { sql, protegido } from './_db.js'

// Se dispara cuando el agente registra un hito real (ej. una venta firmada).
// Genera las tareas de tareas_marketing a partir de la plantilla
// automatizacion_tareas, calculando cada fecha con su offset_dias.
export default protegido(async function handler(req, res, agenteId) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const { automatizacion_id, fecha_evento, contacto_id, propiedad_direccion } = req.body ?? {}
  if (!automatizacion_id || !fecha_evento) {
    return res.status(400).json({ error: 'Faltan automatizacion_id o fecha_evento' })
  }

  const [automatizacion] = await sql`
    SELECT id, evento_disparador FROM automatizaciones WHERE id = ${automatizacion_id}
  `
  if (!automatizacion) return res.status(404).json({ error: 'Automatización no encontrada' })

  const plantillaTareas = await sql`
    SELECT titulo, descripcion, offset_dias FROM automatizacion_tareas
    WHERE automatizacion_id = ${automatizacion_id} ORDER BY offset_dias
  `

  const [evento] = await sql`
    INSERT INTO eventos_hito (agente_id, contacto_id, tipo_evento, fecha_evento, propiedad_direccion, automatizacion_id)
    VALUES (${agenteId}, ${contacto_id ?? null}, ${automatizacion.evento_disparador}, ${fecha_evento}, ${propiedad_direccion ?? null}, ${automatizacion_id})
    RETURNING id
  `

  const tareasCreadas = []
  for (const t of plantillaTareas) {
    const [tarea] = await sql`
      INSERT INTO tareas_marketing (agente_id, contacto_id, evento_hito_id, titulo, descripcion, fecha_programada)
      VALUES (
        ${agenteId}, ${contacto_id ?? null}, ${evento.id}, ${t.titulo}, ${t.descripcion},
        (${fecha_evento}::date + (${t.offset_dias} || ' days')::interval)::date
      )
      RETURNING id, titulo, fecha_programada
    `
    tareasCreadas.push(tarea)
  }

  res.status(201).json({ evento_id: evento.id, tareas: tareasCreadas })
})
