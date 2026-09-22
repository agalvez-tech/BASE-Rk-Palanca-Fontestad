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
