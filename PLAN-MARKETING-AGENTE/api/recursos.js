import { sql, protegido } from './_db.js'

export default protegido(async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }
  const recursos = await sql`
    SELECT id, titulo, categoria, tipo, url, descripcion FROM recursos ORDER BY categoria, titulo
  `
  res.status(200).json(recursos)
})
