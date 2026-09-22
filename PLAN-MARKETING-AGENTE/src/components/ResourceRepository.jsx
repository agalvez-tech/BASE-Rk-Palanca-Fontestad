import { RECURSOS_DEMO } from '../data/mockData.js'

const ICONO_TIPO = { pdf: '📄', docx: '📝', xlsx: '📊', link: '🔗', imagen: '🖼️' }

export default function ResourceRepository({ recursos = RECURSOS_DEMO }) {
  const categorias = [...new Set(recursos.map((r) => r.categoria))]

  return (
    <div style={{ marginTop: 16 }}>
      {categorias.map((cat) => (
        <div className="card" key={cat}>
          <h2>{cat}</h2>
          {recursos
            .filter((r) => r.categoria === cat)
            .map((r) => (
              <a className="recurso-fila" href={r.url} target="_blank" rel="noreferrer" key={r.id}>
                <span className="recurso-icono">{ICONO_TIPO[r.tipo] ?? '📎'}</span>
                <span className="recurso-titulo">{r.titulo}</span>
                <span className="recurso-flecha">→</span>
              </a>
            ))}
        </div>
      ))}
    </div>
  )
}
