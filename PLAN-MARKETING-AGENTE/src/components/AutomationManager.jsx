import { useState } from 'react'
import { AUTOMATIZACIONES_DEMO } from '../data/mockData.js'

const ETIQUETA_EVENTO = {
  venta_firmada: 'Venta firmada',
  compra_firmada: 'Compra firmada',
  captacion_firmada: 'Captación firmada',
  aniversario_cliente: 'Aniversario cliente',
}

function claseOffset(offsetDias) {
  if (offsetDias < 0) return 'neg'
  if (offsetDias === 0) return 'zero'
  return 'pos'
}

function textoOffset(offsetDias) {
  if (offsetDias === 0) return 'Día 0'
  const dias = Math.abs(offsetDias)
  return offsetDias < 0 ? `-${dias} d` : `+${dias} d`
}

// A partir de una fecha de hito, calcula en qué fecha caerá cada tarea
// de la plantilla de automatización (offset_dias respecto al hito).
function simularFechas(automatizacion, fechaHitoISO) {
  if (!fechaHitoISO) return []
  const base = new Date(fechaHitoISO)
  return automatizacion.tareas
    .map((t) => {
      const fecha = new Date(base)
      fecha.setDate(fecha.getDate() + t.offset_dias)
      return { ...t, fechaCalculada: fecha }
    })
    .sort((a, b) => a.offset_dias - b.offset_dias)
}

export default function AutomationManager({
  automatizaciones = AUTOMATIZACIONES_DEMO,
  onGenerarTareas, // (automatizacionId, fechaHitoISO, tareasCalculadas) => void — para conectar con la API real
}) {
  const [abiertaId, setAbiertaId] = useState(automatizaciones[0]?.id ?? null)
  const [fechaHito, setFechaHito] = useState('')
  const [generadoId, setGeneradoId] = useState(null)

  const abierta = automatizaciones.find((a) => a.id === abiertaId)
  const simulacion = abierta ? simularFechas(abierta, fechaHito) : []

  function handleGenerar() {
    if (!abierta || !fechaHito) return
    onGenerarTareas?.(abierta.id, fechaHito, simulacion)
    setGeneradoId(abierta.id)
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 12.5, color: 'var(--gris)', marginBottom: 14 }}>
        Workflows que se disparan al cumplir un hito (ej. firmar una venta) y generan
        automáticamente las tareas del Plan 30-60 y demás seguimiento.
      </p>

      {automatizaciones.map((auto) => {
        const abiertaAhora = auto.id === abiertaId
        return (
          <div
            key={auto.id}
            className={`auto-card ${abiertaAhora ? 'abierta' : ''}`}
            onClick={() => {
              setAbiertaId(abiertaAhora ? null : auto.id)
              setGeneradoId(null)
            }}
          >
            <div className="auto-card-head">
              <span className="nombre">{auto.nombre}</span>
              <span className="badge-evento">{ETIQUETA_EVENTO[auto.evento_disparador]}</span>
            </div>

            {abiertaAhora && (
              <div onClick={(e) => e.stopPropagation()}>
                <div className="timeline">
                  {auto.tareas
                    .slice()
                    .sort((a, b) => a.offset_dias - b.offset_dias)
                    .map((t) => (
                      <div className="timeline-item" key={t.id}>
                        <span className={`timeline-offset ${claseOffset(t.offset_dias)}`}>{textoOffset(t.offset_dias)}</span>
                        <div className="timeline-texto">
                          <div className="titulo">{t.titulo}</div>
                          {t.descripcion && <div className="desc">{t.descripcion}</div>}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="simular-box">
                  <label htmlFor={`fecha-${auto.id}`}>Fecha del hito ({ETIQUETA_EVENTO[auto.evento_disparador].toLowerCase()})</label>
                  <input
                    id={`fecha-${auto.id}`}
                    type="date"
                    value={fechaHito}
                    onChange={(e) => {
                      setFechaHito(e.target.value)
                      setGeneradoId(null)
                    }}
                  />
                  <button className="btn-primario" disabled={!fechaHito} onClick={handleGenerar}>
                    Generar tareas automáticas
                  </button>

                  {generadoId === auto.id && (
                    <div className="resultado-simulacion">
                      {simulacion.map((t) => (
                        <div className="fila" key={t.id}>
                          <span>{t.titulo}</span>
                          <span className="fecha">
                            {t.fechaCalculada.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
