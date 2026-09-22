import { useMemo, useState } from 'react'
import { diasDesde, estadoSemaforo, ETIQUETA_TIPO_CONTACTO } from '../utils/semaforo.js'

const ORDEN_SEMAFORO = { rojo: 0, ambar: 1, verde: 2 }

const TIPOS_CONTACTO = Object.keys(ETIQUETA_TIPO_CONTACTO)
const PRIORIDADES = ['alta', 'media', 'baja']

const CONTACTO_VACIO = {
  nombre: '',
  telefono: '',
  tipo: 'esfera_influencia',
  prioridad: 'media',
  frecuencia_objetivo_dias: 90,
}

export default function ContactsCRM({
  contactos,
  onContactar, // (contactoId) => void — marca "contactado hoy"
  onCrearContacto, // (contacto) => void — da de alta un contacto nuevo
  onEditarContacto, // (id, contacto) => void — guarda cambios de un contacto existente
}) {
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [formEdicion, setFormEdicion] = useState(CONTACTO_VACIO)
  const [formNuevoAbierto, setFormNuevoAbierto] = useState(false)
  const [formNuevo, setFormNuevo] = useState(CONTACTO_VACIO)

  const listado = useMemo(() => {
    return contactos
      .map((c) => ({ ...c, semaforo: estadoSemaforo(c), dias: diasDesde(c.fecha_ultimo_contacto) }))
      .filter((c) => filtroPrioridad === 'todas' || c.prioridad === filtroPrioridad)
      .filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => ORDEN_SEMAFORO[a.semaforo] - ORDEN_SEMAFORO[b.semaforo] || b.dias - a.dias)
  }, [contactos, filtroPrioridad, busqueda])

  function abrirEdicion(c) {
    setFormEdicion({
      nombre: c.nombre,
      telefono: c.telefono ?? '',
      tipo: c.tipo,
      prioridad: c.prioridad,
      frecuencia_objetivo_dias: c.frecuencia_objetivo_dias,
    })
    setEditandoId(c.id)
  }

  function guardarEdicion(id) {
    if (!formEdicion.nombre) return
    onEditarContacto?.(id, formEdicion)
    setEditandoId(null)
  }

  function crearContacto() {
    if (!formNuevo.nombre) return
    onCrearContacto?.(formNuevo)
    setFormNuevo(CONTACTO_VACIO)
    setFormNuevoAbierto(false)
  }

  return (
    <div style={{ marginTop: 16 }}>
      <input
        className="buscador-contactos"
        type="text"
        placeholder="Buscar contacto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="filtro-maquina" style={{ marginTop: 10 }}>
        {['todas', 'alta', 'media', 'baja'].map((p) => (
          <button key={p} className={filtroPrioridad === p ? 'activo' : ''} onClick={() => setFiltroPrioridad(p)}>
            {p === 'todas' ? 'Todas' : `Prioridad ${p}`}
          </button>
        ))}
      </div>

      {!formNuevoAbierto && (
        <button className="btn-anadir-accion" style={{ marginTop: 12 }} onClick={() => setFormNuevoAbierto(true)}>
          + Nuevo contacto
        </button>
      )}

      {formNuevoAbierto && (
        <div className="card" style={{ marginTop: 12 }}>
          <h2>Nuevo contacto</h2>
          <div className="form-accion">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Nombre y apellidos"
              value={formNuevo.nombre}
              onChange={(e) => setFormNuevo((f) => ({ ...f, nombre: e.target.value }))}
            />
            <label>Teléfono</label>
            <input
              type="text"
              placeholder="600 000 000"
              value={formNuevo.telefono}
              onChange={(e) => setFormNuevo((f) => ({ ...f, telefono: e.target.value }))}
            />
            <label>Tipo</label>
            <select value={formNuevo.tipo} onChange={(e) => setFormNuevo((f) => ({ ...f, tipo: e.target.value }))}>
              {TIPOS_CONTACTO.map((t) => (
                <option key={t} value={t}>{ETIQUETA_TIPO_CONTACTO[t]}</option>
              ))}
            </select>
            <label>Prioridad</label>
            <select value={formNuevo.prioridad} onChange={(e) => setFormNuevo((f) => ({ ...f, prioridad: e.target.value }))}>
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <label>Contactar cada (días)</label>
            <input
              type="number"
              min="1"
              value={formNuevo.frecuencia_objetivo_dias}
              onChange={(e) => setFormNuevo((f) => ({ ...f, frecuencia_objetivo_dias: Number(e.target.value) }))}
            />
            <div className="form-accion-botones">
              <button className="btn-secundario" onClick={() => { setFormNuevoAbierto(false); setFormNuevo(CONTACTO_VACIO) }}>
                Cancelar
              </button>
              <button className="btn-primario" disabled={!formNuevo.nombre} onClick={crearContacto}>
                Guardar contacto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 12 }}>
        {listado.length === 0 && <p style={{ fontSize: 12.5, color: 'var(--gris)' }}>Sin contactos para este filtro.</p>}

        {listado.map((c) => {
          const abierto = seleccionadoId === c.id
          const editando = editandoId === c.id
          return (
            <div key={c.id} className="contacto-bloque">
              <div
                className="semaforo-fila"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSeleccionadoId(abierto ? null : c.id)
                  setEditandoId(null)
                }}
              >
                <span className={`punto-semaforo ${c.semaforo}`} />
                <div className="semaforo-info">
                  <div className="nombre">{c.nombre}</div>
                  <div className="detalle">
                    {ETIQUETA_TIPO_CONTACTO[c.tipo]} · prioridad {c.prioridad} · {c.dias === Infinity ? 'sin contacto registrado' : `${c.dias} días sin contacto`}
                  </div>
                </div>
                <span className={`chip ${c.semaforo}`}>
                  {c.semaforo === 'rojo' ? 'Fuera de plazo' : c.semaforo === 'ambar' ? 'Cerca del límite' : 'Al día'}
                </span>
              </div>

              {abierto && !editando && (
                <div className="contacto-detalle">
                  {c.telefono && <div className="contacto-detalle-fila">📞 {c.telefono}</div>}
                  <div className="contacto-detalle-fila">Objetivo de contacto: cada {c.frecuencia_objetivo_dias} días</div>
                  <div className="form-accion-botones">
                    <button className="btn-secundario" onClick={() => abrirEdicion(c)}>Editar</button>
                    <button className="btn-primario" onClick={() => onContactar?.(c.id)}>Marcar contactado hoy</button>
                  </div>
                </div>
              )}

              {abierto && editando && (
                <div className="contacto-detalle">
                  <div className="form-accion">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={formEdicion.nombre}
                      onChange={(e) => setFormEdicion((f) => ({ ...f, nombre: e.target.value }))}
                    />
                    <label>Teléfono</label>
                    <input
                      type="text"
                      value={formEdicion.telefono}
                      onChange={(e) => setFormEdicion((f) => ({ ...f, telefono: e.target.value }))}
                    />
                    <label>Tipo</label>
                    <select value={formEdicion.tipo} onChange={(e) => setFormEdicion((f) => ({ ...f, tipo: e.target.value }))}>
                      {TIPOS_CONTACTO.map((t) => (
                        <option key={t} value={t}>{ETIQUETA_TIPO_CONTACTO[t]}</option>
                      ))}
                    </select>
                    <label>Prioridad</label>
                    <select value={formEdicion.prioridad} onChange={(e) => setFormEdicion((f) => ({ ...f, prioridad: e.target.value }))}>
                      {PRIORIDADES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <label>Contactar cada (días)</label>
                    <input
                      type="number"
                      min="1"
                      value={formEdicion.frecuencia_objetivo_dias}
                      onChange={(e) => setFormEdicion((f) => ({ ...f, frecuencia_objetivo_dias: Number(e.target.value) }))}
                    />
                    <div className="form-accion-botones">
                      <button className="btn-secundario" onClick={() => setEditandoId(null)}>Cancelar</button>
                      <button className="btn-primario" disabled={!formEdicion.nombre} onClick={() => guardarEdicion(c.id)}>
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
