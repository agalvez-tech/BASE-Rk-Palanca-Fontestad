import { useEffect, useState } from 'react'
import { ACCIONES_CATALOGO_DEMO, PLAN_TRIMESTRAL_DEMO } from '../data/mockData.js'

const MIN_ACCIONES = 2
const MAX_ACCIONES = 4

const FORM_VACIO = { accion_catalogo_id: '', dirigido_a: '', frecuencia: '', personalizacion: '' }

export default function PlanConfigurator({
  plan = PLAN_TRIMESTRAL_DEMO,
  catalogo = ACCIONES_CATALOGO_DEMO,
  onAnadirAccion, // (form) => void — persiste la acción añadida en la API real
  onQuitarAccion, // (id) => void — persiste la baja de la acción en la API real
  agenteObjetivo, // { nombre } opcional — un admin viendo el plan de otro agente
  onVolver, // () => void — salir de la vista de admin y volver a "mi plan"
}) {
  const [acciones, setAcciones] = useState(plan.acciones)
  const [catalogoAbierto, setCatalogoAbierto] = useState(false)

  // plan llega primero con datos de ejemplo y luego, si /api responde, con
  // el plan real: hay que resincronizar el estado local cuando eso ocurra.
  useEffect(() => setAcciones(plan.acciones), [plan])

  function accionCatalogo(id) {
    return catalogo.find((a) => a.id === id)
  }
  const [filtroMaquina, setFiltroMaquina] = useState('todas')
  const [form, setForm] = useState(FORM_VACIO)
  const [guardado, setGuardado] = useState(false)

  const puedeAnadir = acciones.length < MAX_ACCIONES
  const puedeGuardar = acciones.length >= MIN_ACCIONES && acciones.length <= MAX_ACCIONES

  const catalogoFiltrado = catalogo.filter((a) => filtroMaquina === 'todas' || a.maquina === filtroMaquina)

  function elegirAccion(accion) {
    setForm({ accion_catalogo_id: accion.id, dirigido_a: '', frecuencia: '', personalizacion: '' })
  }

  function confirmarAccion() {
    if (!form.accion_catalogo_id || !form.dirigido_a || !form.frecuencia) return
    setAcciones((prev) => [...prev, { id: `pa-${Date.now()}`, ...form }])
    onAnadirAccion?.(form)
    setForm(FORM_VACIO)
    setCatalogoAbierto(false)
    setGuardado(false)
  }

  function quitarAccion(id) {
    setAcciones((prev) => prev.filter((a) => a.id !== id))
    onQuitarAccion?.(id)
    setGuardado(false)
  }

  function guardarPlan() {
    setGuardado(true)
  }

  return (
    <div style={{ marginTop: 16 }}>
      {agenteObjetivo && (
        <div className="banner-admin">
          Viendo el plan de <strong>{agenteObjetivo.nombre}</strong>
          <button className="btn-volver-admin" onClick={onVolver}>← Volver a mi plan</button>
        </div>
      )}

      <div className="card">
        <div className="eyebrow">Trimestre {plan.trimestre} · {plan.anio}</div>
        <h2 style={{ marginTop: 2 }}>
          {agenteObjetivo ? `${acciones.length} acciones elegidas` : `Tus ${acciones.length} acciones elegidas`}
        </h2>
        <p style={{ fontSize: 12, color: 'var(--gris)', marginTop: -6, marginBottom: 12 }}>
          Elige entre {MIN_ACCIONES} y {MAX_ACCIONES} acciones concretas para el trimestre.
        </p>

        {acciones.map((pa) => {
          const accion = accionCatalogo(pa.accion_catalogo_id)
          return (
            <div className="plan-accion-fila" key={pa.id}>
              <div className="plan-accion-cabecera">
                <span className={`badge-maquina ${accion?.maquina?.toLowerCase()}`}>{accion?.maquina}</span>
                <span className="plan-accion-nombre">{accion?.nombre}</span>
                <button className="btn-quitar" onClick={() => quitarAccion(pa.id)} aria-label="Quitar acción">×</button>
              </div>
              <div className="plan-accion-detalle"><strong>A quién:</strong> {pa.dirigido_a}</div>
              <div className="plan-accion-detalle"><strong>Frecuencia:</strong> {pa.frecuencia}</div>
              {pa.personalizacion && <div className="plan-accion-detalle"><strong>Personalización:</strong> {pa.personalizacion}</div>}
            </div>
          )
        })}

        {puedeAnadir && (
          <button className="btn-anadir-accion" onClick={() => setCatalogoAbierto(true)}>
            + Añadir acción del catálogo
          </button>
        )}
        {!puedeAnadir && (
          <p style={{ fontSize: 11.5, color: 'var(--gris-claro)', marginTop: 8 }}>Máximo de {MAX_ACCIONES} acciones alcanzado.</p>
        )}

        <button className="btn-primario" disabled={!puedeGuardar} onClick={guardarPlan} style={{ marginTop: 16 }}>
          {guardado ? 'Plan guardado ✓' : 'Guardar plan trimestral'}
        </button>
        {!puedeGuardar && (
          <p style={{ fontSize: 11.5, color: 'var(--rojo)', marginTop: 6 }}>
            Necesitas al menos {MIN_ACCIONES} acciones para guardar el plan.
          </p>
        )}
      </div>

      {catalogoAbierto && (
        <div className="card">
          <h2>Catálogo de acciones</h2>
          <div className="filtro-maquina">
            {['todas', 'M2', 'M3'].map((m) => (
              <button key={m} className={filtroMaquina === m ? 'activo' : ''} onClick={() => setFiltroMaquina(m)}>
                {m === 'todas' ? 'Todas' : m}
              </button>
            ))}
          </div>

          {!form.accion_catalogo_id && (
            <div className="catalogo-lista">
              {catalogoFiltrado.map((a) => (
                <button key={a.id} className="catalogo-item" onClick={() => elegirAccion(a)}>
                  <span className={`badge-maquina ${a.maquina.toLowerCase()}`}>{a.maquina}</span>
                  <span className="catalogo-item-texto">
                    <span className="nombre">{a.nombre}</span>
                    <span className="desc">{a.descripcion}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {form.accion_catalogo_id && (
            <div className="form-accion">
              <div className="form-accion-titulo">{accionCatalogo(form.accion_catalogo_id)?.nombre}</div>

              <label>¿A quién se dirige?</label>
              <input
                type="text"
                placeholder="Ej. Zona Russafa, top 20 esfera de influencia..."
                value={form.dirigido_a}
                onChange={(e) => setForm((f) => ({ ...f, dirigido_a: e.target.value }))}
              />

              <label>Frecuencia</label>
              <input
                type="text"
                placeholder="Ej. Mensual, cada 2 semanas..."
                value={form.frecuencia}
                onChange={(e) => setForm((f) => ({ ...f, frecuencia: e.target.value }))}
              />

              <label>¿Cómo se personalizará?</label>
              <input
                type="text"
                placeholder="Ej. Firma manuscrita + QR a valoración gratuita"
                value={form.personalizacion}
                onChange={(e) => setForm((f) => ({ ...f, personalizacion: e.target.value }))}
              />

              <div className="form-accion-botones">
                <button className="btn-secundario" onClick={() => setForm(FORM_VACIO)}>Volver</button>
                <button
                  className="btn-primario"
                  disabled={!form.dirigido_a || !form.frecuencia}
                  onClick={confirmarAccion}
                >
                  Añadir al plan
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
