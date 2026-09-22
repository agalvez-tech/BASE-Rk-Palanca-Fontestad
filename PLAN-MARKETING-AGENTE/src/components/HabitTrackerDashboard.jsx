import { useEffect, useMemo, useState } from 'react'
import { AGENTE_DEMO, CONTACTOS_DEMO, TAREAS_DEMO, PUNTOS_MES_ACTUAL } from '../data/mockData.js'
import { diasDesde, estadoSemaforo, ETIQUETA_TIPO_CONTACTO as ETIQUETA_TIPO } from '../utils/semaforo.js'

export default function HabitTrackerDashboard({
  agente = AGENTE_DEMO,
  contactos = CONTACTOS_DEMO,
  tareasIniciales = TAREAS_DEMO,
  puntosMes = PUNTOS_MES_ACTUAL,
  onCompletarTarea, // (tareaId, puntos) => void — para conectar con la API real
}) {
  const [tareas, setTareas] = useState(tareasIniciales)

  // tareasIniciales llega primero con datos de ejemplo y luego, si /api
  // responde, con los datos reales: hay que resincronizar el estado local
  // cuando eso ocurra (useState solo lee el valor inicial una vez).
  useEffect(() => setTareas(tareasIniciales), [tareasIniciales])

  const progreso = Math.min(100, Math.round((puntosMes / agente.objetivo_puntos_mensual) * 100))

  const prioritariosEnRiesgo = useMemo(() => {
    return contactos
      .map((c) => ({ ...c, semaforo: estadoSemaforo(c) }))
      .filter((c) => c.prioridad === 'alta' && c.semaforo !== 'verde')
      .sort((a, b) => diasDesde(b.fecha_ultimo_contacto) - diasDesde(a.fecha_ultimo_contacto))
  }, [contactos])

  const tareasHoy = tareas.filter((t) => t.estado !== 'cancelada')

  function toggleTarea(tarea) {
    const completando = tarea.estado !== 'completada'
    setTareas((prev) =>
      prev.map((t) => (t.id === tarea.id ? { ...t, estado: completando ? 'completada' : 'pendiente' } : t))
    )
    if (completando) onCompletarTarea?.(tarea.id, tarea.puntos_otorgados)
  }

  return (
    <div>
      <div className="puntos-hero">
        <div className="eyebrow" style={{ color: 'var(--gris-claro)' }}>Puntos Inolvidable · este mes</div>
        <div className="valor">
          {puntosMes} <span>/ {agente.objetivo_puntos_mensual}</span>
        </div>
        <div className="barra-progreso">
          <div className="relleno" style={{ width: `${progreso}%` }} />
        </div>
        <div className="meta">
          {progreso >= 100
            ? '¡Objetivo mensual cumplido!'
            : `${agente.objetivo_puntos_mensual - puntosMes} puntos para el objetivo del mes`}
        </div>
        <div className="racha" aria-label="Racha de los últimos 7 días">
          {[true, true, false, true, true, true, false].map((hecho, i) => (
            <div key={i} className={`dia ${hecho ? 'hecho' : ''}`} />
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Referidos que necesitan contacto</h2>
        {prioritariosEnRiesgo.length === 0 && (
          <p style={{ fontSize: 12.5, color: 'var(--gris)' }}>Todo al día. Ningún contacto prioritario en riesgo.</p>
        )}
        {prioritariosEnRiesgo.map((c) => {
          const dias = diasDesde(c.fecha_ultimo_contacto)
          return (
            <div className="semaforo-fila" key={c.id}>
              <span className={`punto-semaforo ${c.semaforo}`} />
              <div className="semaforo-info">
                <div className="nombre">{c.nombre}</div>
                <div className="detalle">{ETIQUETA_TIPO[c.tipo]} · {dias} días sin contacto</div>
              </div>
              <span className={`chip ${c.semaforo}`}>{c.semaforo === 'rojo' ? 'Fuera de plazo' : 'Cerca del límite'}</span>
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2>Tareas de marketing</h2>
        {tareasHoy.map((t) => {
          const hecha = t.estado === 'completada'
          return (
            <div className="tarea-fila" key={t.id}>
              <div className={`tarea-check ${hecha ? 'hecha' : ''}`} onClick={() => toggleTarea(t)}>
                {hecha ? '✓' : ''}
              </div>
              <div className="tarea-info">
                <div className={`titulo ${hecha ? 'tachado' : ''}`}>{t.titulo}</div>
                <div className="meta">
                  {t.contacto ? `${t.contacto} · ` : ''}
                  {new Date(t.fecha_programada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              <span className="puntos-pill">+{t.puntos_otorgados}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
