import { useEffect, useState } from 'react'
import PlanConfigurator from './components/PlanConfigurator.jsx'
import ResourceRepository from './components/ResourceRepository.jsx'
import AdminAgentes from './components/AdminAgentes.jsx'
import Login from './components/Login.jsx'
import { api, comprobarSesion } from './api/client.js'
import { AGENTE_DEMO, ACCIONES_CATALOGO_DEMO, PLAN_TRIMESTRAL_DEMO, RECURSOS_DEMO } from './data/mockData.js'

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

  // Solo para gestores: lista de agentes, todas las acciones del equipo
  // juntas, y si se selecciona un agente, su plan (en vez del propio).
  const [agentes, setAgentes] = useState([])
  const [accionesEquipo, setAccionesEquipo] = useState([])
  const [verAgente, setVerAgente] = useState(null)
  const [planAgente, setPlanAgente] = useState(null)

  useEffect(() => {
    comprobarSesion().then(setSesion)
  }, [])

  const esAdmin = sesion.estado === 'autenticado' && sesion.agente.es_admin

  useEffect(() => {
    if (sesion.estado !== 'autenticado' && sesion.estado !== 'sin-backend') return
    api.getCatalogo().then((r) => r && setCatalogo(r))
    api.getPlan().then((r) => r && setPlan({ ...r, acciones: r.acciones }))
    api.getRecursos().then((r) => r && r.length > 0 && setRecursos(r))
  }, [sesion.estado])

  function cargarEquipo() {
    api.getAgentes().then((r) => r && setAgentes(r))
    api.getAccionesEquipo().then((r) => r && setAccionesEquipo(r))
  }

  useEffect(() => {
    if (!esAdmin) return
    cargarEquipo()
  }, [esAdmin])

  useEffect(() => {
    if (!verAgente) return
    api.getPlan(verAgente.id).then((r) => r && setPlanAgente({ ...r, acciones: r.acciones }))
  }, [verAgente])

  function anadirAccionPlan(form) {
    api.anadirAccionPlan(form, verAgente?.id).then(() => esAdmin && cargarEquipo())
  }

  function quitarAccionPlan(id) {
    api.quitarAccionPlan(id, verAgente?.id).then(() => esAdmin && cargarEquipo())
  }

  function verPlanDeAgente(a) {
    setVerAgente(a)
    setTab('plan')
  }

  function volverAMiPlan() {
    setVerAgente(null)
    setPlanAgente(null)
  }

  function cerrarSesion() {
    api.logout().then(() => setSesion({ estado: 'sin-sesion' }))
  }

  if (sesion.estado === 'cargando') return null
  if (sesion.estado === 'sin-sesion') {
    return <Login />
  }

  const agente = sesion.estado === 'autenticado' ? sesion.agente : AGENTE_DEMO

  const TABS = [
    { id: 'plan', label: 'Plan' },
    { id: 'recursos', label: 'Recursos' },
    ...(esAdmin ? [{ id: 'agentes', label: 'Equipo' }] : []),
  ]

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
        {tab === 'plan' && verAgente && (
          <PlanConfigurator
            plan={planAgente ?? { trimestre: verAgente.trimestre, anio: verAgente.anio, acciones: [] }}
            catalogo={catalogo}
            onAnadirAccion={anadirAccionPlan}
            onQuitarAccion={quitarAccionPlan}
            agenteObjetivo={verAgente}
            onVolver={volverAMiPlan}
          />
        )}
        {tab === 'plan' && !verAgente && (
          <PlanConfigurator
            plan={plan}
            catalogo={catalogo}
            onAnadirAccion={anadirAccionPlan}
            onQuitarAccion={quitarAccionPlan}
          />
        )}
        {tab === 'recursos' && <ResourceRepository recursos={recursos} />}
        {tab === 'agentes' && esAdmin && (
          <AdminAgentes agentes={agentes} acciones={accionesEquipo} onVerPlan={verPlanDeAgente} />
        )}
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
