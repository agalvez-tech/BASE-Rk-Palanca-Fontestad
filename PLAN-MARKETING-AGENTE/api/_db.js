import { neon } from '@neondatabase/serverless'
import { leerSesion } from './_auth.js'

export const sql = neon(process.env.DATABASE_URL)

// Evita que un id mal formado (o cualquier error de la base de datos)
// tumbe la función: se convierte en un 400/500 en vez de una excepción
// sin capturar.
export function conManejoErrores(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      const esIdInvalido = err?.code === '22P02' // invalid_text_representation (uuid mal formado)
      console.error(err)
      res.status(esIdInvalido ? 400 : 500).json({ error: esIdInvalido ? 'Id inválido' : 'Error interno' })
    }
  }
}

// Exige sesión válida (cookie con JWT firmado, ver _auth.js) antes de
// ejecutar el handler, y le pasa el id del agente autenticado como
// tercer argumento. Cada agente solo ve y modifica sus propios datos.
export function protegido(handler) {
  return conManejoErrores(async (req, res) => {
    const sesion = await leerSesion(req)
    if (!sesion) return res.status(401).json({ error: 'No autenticado' })
    return handler(req, res, sesion.id)
  })
}

export async function esAdmin(agenteId) {
  const [fila] = await sql`SELECT es_admin FROM agentes WHERE id = ${agenteId}`
  return fila?.es_admin === true
}

// Como protegido(), pero además exige que el agente autenticado sea
// administrador (403 si no lo es). Para las rutas que ven/gestionan el
// plan de todos los agentes.
export function protegidoAdmin(handler) {
  return protegido(async (req, res, agenteId) => {
    if (!(await esAdmin(agenteId))) return res.status(403).json({ error: 'Solo para administradores' })
    return handler(req, res, agenteId)
  })
}
