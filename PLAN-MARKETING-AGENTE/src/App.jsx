import { useEffect, useState } from 'react'
import HabitTrackerDashboard from './components/HabitTrackerDashboard.jsx'
import PlanConfigurator from './components/PlanConfigurator.jsx'
import ContactsCRM from './components/ContactsCRM.jsx'
import AutomationManager from './components/AutomationManager.jsx'
import ResourceRepository from './components/ResourceRepository.jsx'
import Login from './components/Login.jsx'
import { api, comprobarSesion } from './api/client.js'
import {
  AGENTE_DEMO,
  CONTACTOS_DEMO,
  TAREAS_DEMO,
  PUNTOS_MES_ACTUAL,
  ACCIONES_CATALOGO_DEMO,
  PLAN_TRIMESTRAL_DEMO,
  AUTOMATIZACIONES_DEMO,
  RECURSOS_DEMO,
} from './data/mockData.js'

const TABS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'plan', label: 'Plan' },
  { id: 'contactos', label: 'Contactos' },
  { id: 'automatizaciones', label: 'Automatiz.' },
  { id: 'recursos', label: 'Recursos' },
]

export default function App() {
  const [tab, setTab] = useState('inicio')

  // 'cargando' → 'sin-backend' (npm run dev a secas: sigue en modo demo),
  // 'sin-sesion' (hay backend pero no hay login: pantalla de acceso), o
  // 'autenticado' (agente real).
  const [sesion, setSesion] = useState({ estado: 'cargando' })

  // Todo arranca con los datos de ejemplo. En cuanto hay sesión (real o
  // "sin-backend", que igualmente intenta y falla en silencio) se piden
  // los datos reales y sustituyen a los de ejemplo.
  const [contactos, setContactos] = useState(CONTACTOS_DEMO)
  const [tareas, setTareas] = useState(TAREAS_DEMO)
  const [puntos, setPuntos] = useState({ puntos_mes: PUNTOS_MES_ACTUAL, objetivo_puntos_mensual: AGENTE_DEMO.objetivo_puntos_mensual })
  const [catalogo, setCatalogo] = useState(ACCIONES_CATALOGO_DEMO)
  const [plan, setPlan] = useState(PLAN_TRIMESTRAL_DEMO)
  const [automatizaciones, setAutomatizaciones] = useState(AUTOMATIZACIONES_DEMO)
  const [recursos, setRecursos] = useState(RECURSOS_DEMO)

  useEffect(() => {
    comprobarSesion().then(setSesion)
  }, [])

  useEffect(() => {
    if (sesion.estado !== 'autenticado' && sesion.estado !== 'sin-backend') return
    api.getContactos().then((r) => r && setContactos(r))
    api.getTareas().then((r) => r && setTareas(r))
    api.getPuntos().then((r) => r && setPuntos(r))
    api.getCatalogo().then((r) => r && setCatalogo(r))
    api.getPlan().then((r) => r && setPlan({ ...r, acciones: r.acciones }))
    api.getAutomatizaciones().then((r) => r && r.length > 0 && setAutomatizaciones(r))
    api.getRecursos().then((r) => r && r.length > 0 && setRecursos(r))
  }, [sesion.estado])

  function marcarContactado(contactoId) {
    const hoy = new Date().toISOString().slice(0, 10)
    setContactos((prev) => prev.map((c) => (c.id === contactoId ? { ...c, fecha_ultimo_contacto: hoy } : c)))
    api.marcarContactado(contactoId)
  }

  function crearContacto(datos) {
    const idTemporal = `tmp-${Date.now()}`
    setContactos((prev) => [...prev, { id: idTemporal, fecha_ultimo_contacto: null, ...datos }])
    api.crearContacto(datos).then((creado) => {
      if (creado) setContactos((prev) => prev.map((c) => (c.id === idTemporal ? creado : c)))
    })
  }

  function editarContacto(contactoId, datos) {
    setContactos((prev) => prev.map((c) => (c.id === contactoId ? { ...c, ...datos } : c)))
    api.editarContacto(contactoId, datos)
  }

  function completarTarea(tareaId) {
    // El check ya se refleja al instante en HabitTrackerDashboard (estado local);
    // aquí persistimos el cambio (y los puntos) en el backend si existe.
    api.toggleTarea(tareaId).then((r) => r && api.getPuntos().then((p) => p && setPuntos(p)))
  }

  function anadirAccionPlan(form) {
    api.anadirAccionPlan(form)
  }

  function quitarAccionPlan(id) {
    api.quitarAccionPlan(id)
  }

  function generarTareasAutomatizacion(automatizacionId, fechaHitoISO) {
    api.generarTareas({ automatizacion_id: automatizacionId, fecha_evento: fechaHitoISO })
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
        {tab === 'inicio' && (
          <HabitTrackerDashboard
            contactos={contactos}
            tareasIniciales={tareas}
            puntosMes={puntos.puntos_mes}
            agente={{ ...agente, objetivo_puntos_mensual: puntos.objetivo_puntos_mensual }}
            onCompletarTarea={completarTarea}
          />
        )}
        {tab === 'plan' && (
          <PlanConfigurator
            plan={plan}
            catalogo={catalogo}
            onAnadirAccion={anadirAccionPlan}
            onQuitarAccion={quitarAccionPlan}
          />
        )}
        {tab === 'contactos' && (
          <ContactsCRM
            contactos={contactos}
            onContactar={marcarContactado}
            onCrearContacto={crearContacto}
            onEditarContacto={editarContacto}
          />
        )}
        {tab === 'automatizaciones' && (
          <AutomationManager automatizaciones={automatizaciones} onGenerarTareas={generarTareasAutomatizacion} />
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
