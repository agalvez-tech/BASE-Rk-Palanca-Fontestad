import { useState } from 'react'

export default function AdminAgentes({ agentes, acciones, onVerPlan }) {
  const [vista, setVista] = useState('agentes')

  const porAgente = agrupar(acciones, (a) => a.agente_id)

  return (
    <div style={{ marginTop: 16 }}>
      <div className="filtro-maquina">
        <button className={vista === 'agentes' ? 'activo' : ''} onClick={() => setVista('agentes')}>Por agente</button>
        <button className={vista === 'acciones' ? 'activo' : ''} onClick={() => setVista('acciones')}>
          Todas las acciones ({acciones.length})
        </button>
      </div>

      {vista === 'agentes' && (
        <div className="card">
          <h2>Agentes ({agentes.length})</h2>
          {agentes.length === 0 && <p style={{ fontSize: 12.5, color: 'var(--gris)' }}>Todavía no hay agentes registrados.</p>}
          {agentes.map((a) => (
            <button className="agente-fila" key={a.id} onClick={() => onVerPlan(a)}>
              {a.avatar_url && <img className="agente-avatar" src={a.avatar_url} alt="" />}
              {!a.avatar_url && <span className="agente-avatar agente-avatar-vacio">{a.nombre?.[0]}</span>}
              <span className="agente-info">
                <span className="agente-nombre">
                  {a.nombre}
                  {a.es_admin && <span className="chip-admin">Gestor</span>}
                </span>
                <span className="agente-detalle">{a.email}</span>
              </span>
              <span className={`chip-plan ${a.total_acciones > 0 ? 'con-plan' : 'sin-plan'}`}>
                {a.total_acciones > 0
                  ? `${a.total_acciones} ${a.total_acciones === 1 ? 'acción' : 'acciones'} · T${a.trimestre} ${a.anio}`
                  : 'Sin plan'}
              </span>
            </button>
          ))}
        </div>
      )}

      {vista === 'acciones' && (
        <>
          {acciones.length === 0 && (
            <div className="card">
              <p style={{ fontSize: 12.5, color: 'var(--gris)' }}>Ningún agente tiene todavía acciones en su plan.</p>
            </div>
          )}
          {Object.entries(porAgente).map(([agenteId, filas]) => (
            <div className="card" key={agenteId}>
              <h2>{filas[0].agente_nombre} ({filas.length})</h2>
              {filas.map((f) => (
                <div className="plan-accion-fila" key={f.id}>
                  <div className="plan-accion-cabecera">
                    <span className={`badge-maquina ${f.maquina.toLowerCase()}`}>{f.maquina}</span>
                    <span className="plan-accion-nombre">{f.accion_nombre}</span>
                  </div>
                  <div className="plan-accion-detalle"><strong>A quién:</strong> {f.dirigido_a}</div>
                  <div className="plan-accion-detalle"><strong>Frecuencia:</strong> {f.frecuencia}</div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function agrupar(lista, clave) {
  const grupos = {}
  for (const item of lista) {
    const k = clave(item)
    if (!grupos[k]) grupos[k] = []
    grupos[k].push(item)
  }
  return grupos
}
