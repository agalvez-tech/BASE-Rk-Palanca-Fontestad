// Cliente ligero para /api. Si el backend no responde (p. ej. estás con
// `npm run dev` y no con `vercel dev`, así que /api no existe todavía),
// las funciones devuelven null y la app sigue funcionando con los datos
// de ejemplo de src/data/mockData.js.

async function llamar(url, opciones) {
  try {
    const res = await fetch(url, opciones)
    if (!res.ok) return null
    if (res.status === 204) return true
    return await res.json()
  } catch {
    return null
  }
}

export const api = {
  getContactos: () => llamar('/api/contactos'),
  marcarContactado: (id) => llamar(`/api/contactos?id=${id}`, { method: 'PATCH' }),
  crearContacto: (payload) =>
    llamar('/api/contactos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  editarContacto: (id, payload) =>
    llamar(`/api/contactos?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  getCatalogo: () => llamar('/api/catalogo'),

  getPlan: () => llamar('/api/plan'),
  anadirAccionPlan: (payload) =>
    llamar('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  quitarAccionPlan: (id) => llamar(`/api/plan?id=${id}`, { method: 'DELETE' }),

  getTareas: () => llamar('/api/tareas'),
  toggleTarea: (id) => llamar(`/api/tareas?id=${id}`, { method: 'PATCH' }),

  getPuntos: () => llamar('/api/puntos'),

  getAutomatizaciones: () => llamar('/api/automatizaciones'),
  generarTareas: (payload) =>
    llamar('/api/eventos-hito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  getRecursos: () => llamar('/api/recursos'),

  loginConGoogle: (credential) =>
    llamar('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    }),
  logout: () => llamar('/api/auth/logout', { method: 'POST' }),
}

// Comprueba la sesión al arrancar, distinguiendo tres casos:
// - 'sin-backend': /api no existe (p. ej. `npm run dev` a secas) → modo demo.
// - 'sin-sesion': el backend responde pero no hay cookie válida → pantalla de login.
// - 'autenticado': hay sesión, se devuelve el perfil del agente.
export async function comprobarSesion() {
  try {
    const res = await fetch('/api/auth/me')
    if (res.status === 401) return { estado: 'sin-sesion' }
    if (!res.ok) return { estado: 'sin-backend' }
    const agente = await res.json()
    return { estado: 'autenticado', agente }
  } catch {
    return { estado: 'sin-backend' }
  }
}
