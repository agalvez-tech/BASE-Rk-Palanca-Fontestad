import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }
  const acciones = await sql`
    SELECT id, codigo, nombre, maquina, categoria, descripcion, puntos_valor
    FROM acciones_catalogo WHERE activo = true ORDER BY maquina, categoria
  `
  res.status(200).json(acciones)
})
