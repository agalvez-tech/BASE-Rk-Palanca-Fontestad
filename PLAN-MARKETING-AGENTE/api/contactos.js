import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res, agenteId) {
  if (req.method === 'GET') {
    const contactos = await sql`
      SELECT id, nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, fecha_ultimo_contacto
      FROM contactos WHERE agente_id = ${agenteId} ORDER BY nombre
    `
    return res.status(200).json(contactos)
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Falta id' })
    const [contacto] = await sql`
      UPDATE contactos SET fecha_ultimo_contacto = CURRENT_DATE
      WHERE id = ${id} AND agente_id = ${agenteId}
      RETURNING id, fecha_ultimo_contacto
    `
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' })
    return res.status(200).json(contacto)
  }

  if (req.method === 'POST') {
    const { nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, origen, notas } = req.body ?? {}
    if (!nombre) return res.status(400).json({ error: 'Falta nombre' })

    const [contacto] = await sql`
      INSERT INTO contactos (agente_id, nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, origen, notas)
      VALUES (
        ${agenteId}, ${nombre}, ${telefono ?? null}, ${email ?? null},
        ${tipo ?? 'esfera_influencia'}, ${prioridad ?? 'media'},
        ${frecuencia_objetivo_dias ?? 90}, ${origen ?? null}, ${notas ?? null}
      )
      RETURNING id, nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, fecha_ultimo_contacto
    `
    return res.status(201).json(contacto)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'Falta id' })
    const { nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, origen, notas } = req.body ?? {}
    if (!nombre) return res.status(400).json({ error: 'Falta nombre' })

    const [contacto] = await sql`
      UPDATE contactos SET
        nombre = ${nombre},
        telefono = ${telefono ?? null},
        email = ${email ?? null},
        tipo = ${tipo ?? 'esfera_influencia'},
        prioridad = ${prioridad ?? 'media'},
        frecuencia_objetivo_dias = ${frecuencia_objetivo_dias ?? 90},
        origen = ${origen ?? null},
        notas = ${notas ?? null}
      WHERE id = ${id} AND agente_id = ${agenteId}
      RETURNING id, nombre, telefono, email, tipo, prioridad, frecuencia_objetivo_dias, fecha_ultimo_contacto
    `
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' })
    return res.status(200).json(contacto)
  }

  res.setHeader('Allow', 'GET, POST, PATCH, PUT')
  return res.status(405).end()
})
