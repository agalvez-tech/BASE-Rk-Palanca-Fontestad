import { useEffect, useState } from 'react'
import PlanConfigurator from './components/PlanConfigurator.jsx'
import ResourceRepository from './components/ResourceRepository.jsx'
import Login from './components/Login.jsx'
import { api, comprobarSesion } from './api/client.js'
import { AGENTE_DEMO, ACCIONES_CATALOGO_DEMO, PLAN_TRIMESTRAL_DEMO, RECURSOS_DEMO } from './data/mockData.js'

const TABS = [
  { id: 'plan', label: 'Plan' },
  { id: 'recursos', label: 'Recursos' },
]

export default function App() {
  const [tab, setTab] = useState('plan')

  // 'cargando' → 'sin-backend' (npm run dev a secas: sigue en modo demo),
  // 'sin-sesion' (hay backend pero no hay login: pantalla de acceso), o
  // 'autenticado' (agente real).
  const [sesion, setSesion] = useState({ estado: 'cargando' })

  // Todo arranca con los datos de ejemplo. En cuanto hay sesión (real o
  // "sin-backend", que igualmente intenta y falla en silencio) se piden
  // los datos reales y sustituyen a los de ejemplo.
  const [catalogo, setCatalogo] = useState(ACCIONES_CATALOGO_DEMO)
  const [plan, setPlan] = useState(PLAN_TRIMESTRAL_DEMO)
  const [recursos, setRecursos] = useState(RECURSOS_DEMO)

  useEffect(() => {
    comprobarSesion().then(setSesion)
  }, [])

  useEffect(() => {
    if (sesion.estado !== 'autenticado' && sesion.estado !== 'sin-backend') return
    api.getCatalogo().then((r) => r && setCatalogo(r))
    api.getPlan().then((r) => r && setPlan({ ...r, acciones: r.acciones }))
    api.getRecursos().then((r) => r && r.length > 0 && setRecursos(r))
  }, [sesion.estado])

  function anadirAccionPlan(form) {
    api.anadirAccionPlan(form)
  }

  function quitarAccionPlan(id) {
    api.quitarAccionPlan(id)
  }

  function cerrarSesion() {
    api.logout().then(() => setSesion({ estado: 'sin-sesion' }))
  }

  if (sesion.estado === 'cargando') return null
  if (sesion.estado === 'sin-sesion') {
    return <Login />
  }

  const agente = sesion.estado === 'autenticado' ? sesion.agente : AGENTE_DEMO

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <span className="rk">
          RK<span>·</span>Plan
        </span>
        <span className="titulo">Marketing del agente</span>
        {sesion.estado === 'sin-backend' && <span className="badge-demo">Demo</span>}
        {sesion.estado === 'autenticado' && (
          <div className="perfil-topbar">
            {agente.avatar_url && <img className="perfil-avatar" src={agente.avatar_url} alt="" />}
            <span className="perfil-nombre">{agente.nombre?.split(' ')[0]}</span>
            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>Salir</button>
          </div>
        )}
      </div>

      <div className="app-content">
        {tab === 'plan' && (
          <PlanConfigurator
            plan={plan}
            catalogo={catalogo}
            onAnadirAccion={anadirAccionPlan}
            onQuitarAccion={quitarAccionPlan}
          />
        )}
        {tab === 'recursos' && <ResourceRepository recursos={recursos} />}
      </div>

      <nav className="app-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'activo' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
