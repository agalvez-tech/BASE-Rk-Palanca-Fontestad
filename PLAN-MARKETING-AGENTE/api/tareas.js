import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res, agenteId) {
  if (req.method === 'GET') {
    const tareas = await sql`
      SELECT t.id, t.titulo, t.fecha_programada, t.estado, t.puntos_otorgados, c.nombre AS contacto
      FROM tareas_marketing t LEFT JOIN contactos c ON c.id = t.contacto_id
      WHERE t.agente_id = ${agenteId} AND t.estado != 'cancelada'
      ORDER BY t.fecha_programada DESC
    `
    return res.status(200).json(tareas)
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Falta id' })

    const [tarea] = await sql`
      SELECT estado, puntos_otorgados, titulo FROM tareas_marketing WHERE id = ${id} AND agente_id = ${agenteId}
    `
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' })

    const completando = tarea.estado !== 'completada'
    const nuevoEstado = completando ? 'completada' : 'pendiente'

    await sql`
      UPDATE tareas_marketing
      SET estado = ${nuevoEstado}, fecha_completada = ${completando ? new Date().toISOString() : null}
      WHERE id = ${id}
    `

    if (completando) {
      await sql`
        INSERT INTO puntos_historial (agente_id, tarea_id, puntos, motivo)
        VALUES (${agenteId}, ${id}, ${tarea.puntos_otorgados}, ${'Tarea completada: ' + tarea.titulo})
      `
    } else {
      await sql`DELETE FROM puntos_historial WHERE tarea_id = ${id}`
    }

    return res.status(200).json({ id, estado: nuevoEstado })
  }

  res.setHeader('Allow', 'GET, PATCH')
  return res.status(405).end()
})
