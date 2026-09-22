import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client.js'

const DOMINIO = 'inmobiliariapalanca.com'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Login() {
  const botonRef = useRef(null)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!CLIENT_ID || !window.google?.accounts?.id) return

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      hd: DOMINIO, // sugiere el dominio en el selector de Google; el backend igual lo verifica
      callback: async ({ credential }) => {
        setCargando(true)
        setError(null)
        const agente = await api.loginConGoogle(credential)
        if (agente) {
          // Recarga completa en vez de solo actualizar el estado de React:
          // así la transición a la app es siempre fiable, pase lo que pase
          // con el ciclo de vida del botón de Google (p. ej. si el usuario
          // hizo doble clic o el callback tarda en resolver).
          window.location.reload()
          return
        }
        setCargando(false)
        setError(`No se ha podido entrar. Comprueba que usas tu cuenta @${DOMINIO}.`)
      },
    })

    if (botonRef.current) {
      window.google.accounts.id.renderButton(botonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 280,
      })
    }
  }, [])

  return (
    <div className="login-pantalla">
      <div className="login-card">
        <div className="rk" style={{ fontSize: 22, marginBottom: 6 }}>
          RK<span>·</span>Plan
        </div>
        <p style={{ fontSize: 13, color: 'var(--gris)', marginBottom: 24 }}>
          Marketing del agente — entra con tu cuenta de RK Palanca Fontestad
        </p>

        {!CLIENT_ID && (
          <p style={{ fontSize: 12.5, color: 'var(--rojo)' }}>
            Falta configurar VITE_GOOGLE_CLIENT_ID en el frontend.
          </p>
        )}

        <div ref={botonRef} />

        {cargando && <p style={{ fontSize: 12.5, color: 'var(--gris)', marginTop: 14 }}>Entrando…</p>}
        {error && <p style={{ fontSize: 12.5, color: 'var(--rojo)', marginTop: 14 }}>{error}</p>}

        <p style={{ fontSize: 11, color: 'var(--gris-claro)', marginTop: 24 }}>
          Solo cuentas @{DOMINIO}
        </p>
      </div>
    </div>
  )
}
