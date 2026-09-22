export default function AdminAgentes({ agentes, onVerPlan }) {
  return (
    <div style={{ marginTop: 16 }}>
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
                {a.es_admin && <span className="chip-admin">Admin</span>}
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
    </div>
  )
}
