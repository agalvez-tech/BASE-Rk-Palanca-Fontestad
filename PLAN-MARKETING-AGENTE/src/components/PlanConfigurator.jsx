import { useEffect, useState } from 'react'
import { ACCIONES_CATALOGO_DEMO, PLAN_TRIMESTRAL_DEMO } from '../data/mockData.js'

const MAX_ACCIONES = 4

const FORM_VACIO = { accion_catalogo_id: '', dirigido_a: '', frecuencia: '', personalizacion: '' }

// Varias categorías comparten nombres de acción (p. ej. "Firma de acuerdo"
// existe en Comercio Aliado y en Win Win), así que hay que mostrar siempre
// la categoría para no confundirlas. Cuando el nombre ya es la categoría
// (p. ej. "Redes sociales") no hace falta repetirlo.
function etiquetaAccion(accion) {
  if (!accion) return ''
  return accion.nombre === accion.categoria ? accion.nombre : `${accion.categoria}: ${accion.nombre}`
}

function agruparPorCategoria(lista) {
  const grupos = {}
  for (const a of lista) {
    if (!grupos[a.categoria]) grupos[a.categoria] = []
    grupos[a.categoria].push(a)
  }
  return grupos
}

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
  const [form, setForm] = useState(FORM_VACIO)

  // plan llega primero con datos de ejemplo y luego, si /api responde, con
  // el plan real: hay que resincronizar el estado local cuando eso ocurra.
  useEffect(() => setAcciones(plan.acciones), [plan])

  function accionCatalogo(id) {
    return catalogo.find((a) => a.id === id)
  }

  const puedeAnadir = acciones.length < MAX_ACCIONES
  const catalogoAgrupado = agruparPorCategoria(catalogo)

  function elegirAccion(accion) {
    setForm({ accion_catalogo_id: accion.id, dirigido_a: '', frecuencia: '', personalizacion: '' })
  }

  function confirmarAccion() {
    if (!form.accion_catalogo_id || !form.dirigido_a || !form.frecuencia) return
    setAcciones((prev) => [...prev, { id: `pa-${Date.now()}`, ...form }])
    onAnadirAccion?.(form)
    setForm(FORM_VACIO)
    setCatalogoAbierto(false)
  }

  function quitarAccion(id) {
    setAcciones((prev) => prev.filter((a) => a.id !== id))
    onQuitarAccion?.(id)
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
        <h2>{agenteObjetivo ? 'Plan de Marketing' : 'Tu Plan de Marketing'}</h2>
        {acciones.length === 0 && (
          <p style={{ fontSize: 12.5, color: 'var(--gris)', marginTop: -6, marginBottom: 12 }}>
            Todavía no hay acciones elegidas.
          </p>
        )}

        {acciones.map((pa) => {
          const accion = accionCatalogo(pa.accion_catalogo_id)
          return (
            <div className="plan-accion-fila" key={pa.id}>
              <div className="plan-accion-cabecera">
                <span className="plan-accion-nombre">{etiquetaAccion(accion)}</span>
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
      </div>

      {catalogoAbierto && (
        <div className="card">
          <h2>Catálogo de acciones</h2>

          {!form.accion_catalogo_id && (
            <>
              {Object.entries(catalogoAgrupado).map(([categoria, items]) => (
                <div key={categoria} className="catalogo-grupo">
                  <div className="catalogo-grupo-titulo">{categoria}</div>
                  <div className="catalogo-lista">
                    {items.map((a) => (
                      <button key={a.id} className="catalogo-item" onClick={() => elegirAccion(a)}>
                        <span className="catalogo-item-texto">
                          <span className="nombre">{a.nombre}</span>
                          <span className="desc">{a.descripcion}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-secundario" style={{ width: '100%', marginTop: 8 }} onClick={() => setCatalogoAbierto(false)}>
                Cerrar
              </button>
            </>
          )}

          {form.accion_catalogo_id && (
            <div className="form-accion">
              <div className="form-accion-titulo">{etiquetaAccion(accionCatalogo(form.accion_catalogo_id))}</div>

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
