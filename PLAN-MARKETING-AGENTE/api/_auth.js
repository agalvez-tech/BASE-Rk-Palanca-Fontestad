import { SignJWT, jwtVerify } from 'jose'

const NOMBRE_COOKIE = 'session'
const DIAS_SESION = 30

function secreto() {
  if (!process.env.SESSION_SECRET) throw new Error('Falta SESSION_SECRET')
  return new TextEncoder().encode(process.env.SESSION_SECRET)
}

export async function crearSesionToken(agente) {
  return new SignJWT({ email: agente.email, nombre: agente.nombre })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(agente.id)
    .setIssuedAt()
    .setExpirationTime(`${DIAS_SESION}d`)
    .sign(secreto())
}

// Lee y verifica la cookie de sesión de la petición. Devuelve
// { id, email, nombre } del agente, o null si no hay sesión válida.
export async function leerSesion(req) {
  const cabecera = req.headers.cookie || ''
  const match = cabecera.match(new RegExp(`(?:^|; )${NOMBRE_COOKIE}=([^;]+)`))
  if (!match) return null
  try {
    const { payload } = await jwtVerify(decodeURIComponent(match[1]), secreto())
    return { id: payload.sub, email: payload.email, nombre: payload.nombre }
  } catch {
    return null
  }
}

export function cookieSesion(token) {
  const maxAge = 60 * 60 * 24 * DIAS_SESION
  return `${NOMBRE_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}

export function cookieBorrar() {
  return `${NOMBRE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}
