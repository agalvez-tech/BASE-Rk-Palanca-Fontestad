import { useState, useEffect, useMemo, useRef } from 'react'
import { CATEGORIAS_BASE, PROCESOS_BASE, CRM } from './data.js'
import Astronauta from './Astronauta.jsx'
import IconoTipo from './IconoTipo.jsx'

const VALORES = ['Fuerza', 'Compromiso', 'Unión', 'Crecimiento', 'Inolvidable', 'Tradición + Innovación']
const SLACK_ALMUDENA = 'https://inmobiliaria-palanca.slack.com/team/U0A7KM0FREX'

const FAVORITOS_KEY = 'base:favoritos'
const RECIENTES_KEY = 'base:recientes'
const MAX_RECIENTES = 6

function leerJSON(key, porDefecto) {
  try {
    const guardado = localStorage.getItem(key)
    return guardado ? JSON.parse(guardado) : porDefecto
  } catch {
    return porDefecto
  }
}

function guardarJSON(key, valor) {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    // localStorage no disponible (modo privado, etc.) — se pierde la persistencia, no la funcionalidad
  }
}

/* ---------- presentación ---------- */
function useRevelar(deps = []) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visto')
          obs.unobserve(en.target)
        }
      }),
      { threshold: 0.18 },
    )
    document.querySelectorAll('.revelar:not(.visto)').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function Cifra({ meta, sufijo }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([en]) => { if (en.isIntersecting) { setActivo(true); obs.disconnect() } },
      { threshold: 0.4 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!activo) return
    const dur = 1300
    const t0 = performance.now()
    let raf
    const paso = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(meta * eased))
      if (p < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [activo, meta])

  return (
    <div className="cifra" ref={ref}>
      {val.toLocaleString('es-ES')}
      {sufijo && val >= meta ? <small>{sufijo}</small> : null}
    </div>
  )
}

const FlechaIcono = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function TarjetaProceso({ p, favorito, onFavorito, onAbrir }) {
  return (
    <a className="card" href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => onAbrir(p.id)}>
      <div className="fila">
        <span className="badge"><IconoTipo tipo={p.tipo} />{p.tipo}</span>
        <span className="fila-acciones">
          <button
            type="button"
            className={`fav-btn${favorito ? ' activo' : ''}`}
            aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-pressed={favorito}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorito(p.id) }}
          >
            {favorito ? '★' : '☆'}
          </button>
          <span className="flecha"><FlechaIcono /></span>
        </span>
      </div>
      <h3>{p.nombre}</h3>
      {p.desc && <p>{p.desc}</p>}
    </a>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [filtroCat, setFiltroCat] = useState('TODOS')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [topbarPegada, setTopbarPegada] = useState(false)
  const [favoritos, setFavoritos] = useState(() => new Set(leerJSON(FAVORITOS_KEY, [])))
  const [recientes, setRecientes] = useState(() => leerJSON(RECIENTES_KEY, []))
  const buscadorRef = useRef(null)

  const alternarFavorito = (id) => {
    setFavoritos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      guardarJSON(FAVORITOS_KEY, [...next])
      return next
    })
  }

  const registrarReciente = (id) => {
    setRecientes((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECIENTES)
      guardarJSON(RECIENTES_KEY, next)
      return next
    })
  }

  const estrellas = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: (Math.random() * 2 + 1).toFixed(1),
    d: (Math.random() * 3 + 2).toFixed(1),
    r: (Math.random() * 4).toFixed(1),
    o: (Math.random() * 0.5 + 0.3).toFixed(2),
  })), [])

  const todos = useMemo(
    () => PROCESOS_BASE.map((p) => ({ ...p, id: p.url })),
    [],
  )

  const accesosRapidos = useMemo(() => {
    const favs = todos.filter((p) => favoritos.has(p.id))
    const recientesItems = recientes
      .map((id) => todos.find((p) => p.id === id))
      .filter((p) => p && !favoritos.has(p.id))
    return { favs, recientesItems }
  }, [todos, favoritos, recientes])

  const filtrados = useMemo(() => {
    const t = filtroTexto.trim().toLowerCase()
    return todos.filter((p) => {
      const okCat = filtroCat === 'TODOS' || p.cat === filtroCat
      const okTxt = !t || `${p.nombre} ${p.desc || ''} ${p.cat} ${p.tipo}`.toLowerCase().includes(t)
      return okCat && okTxt
    })
  }, [todos, filtroCat, filtroTexto])

  const secciones = useMemo(
    () => CATEGORIAS_BASE
      .filter((c) => filtrados.some((p) => p.cat === c))
      .map((c, idx) => ({ cat: c, idx, items: filtrados.filter((p) => p.cat === c) })),
    [filtrados],
  )

  useRevelar([secciones])

  useEffect(() => {
    const onScroll = () => setTopbarPegada(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onKey = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault()
        buscadorRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      <header className={`topbar${topbarPegada ? ' pegada' : ''}`}>
        <a className="marca" href="#top">
          <img className="logo-topbar" src="/logo-horiz-negro.png" alt="RK Palanca Fontestad · by Realmark Inmobiliaria" />
        </a>
        <span className="topbar-lema">Desde 1976 · L'Horta Nord</span>
      </header>

      <section className="hero" id="top">
        <img className="logo-hero" src="/logo-vert-blanco.png" alt="" />
        <div className="estrellas" aria-hidden="true">
          {estrellas.map((e) => (
            <i key={e.id} className="estrella" style={{ left: `${e.x}%`, top: `${e.y}%`, width: `${e.s}px`, height: `${e.s}px`, opacity: e.o, '--d': `${e.d}s`, '--r': `${e.r}s` }} />
          ))}
        </div>
        <div className="sol" aria-hidden="true"><div className="orbita" /></div>
        <Astronauta className="astro" />
        <div className="hero-contenido">
          <span className="eyebrow">Nivel Leyenda · El punto de partida</span>
          <h1>BAS<span className="e">E</span></h1>
          <p className="sub">Todos los trámites, formularios, conocimiento y herramientas de la oficina, <strong>en un solo lugar</strong>. Busca, abre y trabaja.</p>
        </div>
        <div className="lugar">L'Horta Nord · Valencia · Desde 1976</div>
      </section>

      <div className="buscador-wrap">
        <div className="buscador">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" strokeLinecap="round" /></svg>
          <input
            ref={buscadorRef}
            type="text"
            placeholder="Buscar un proceso, formulario o herramienta…"
            autoComplete="off"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
          <span className="atajo">/</span>
        </div>
      </div>

      <section className="crm-wrap">
        <div className="crm-titulo">Tus paneles de trabajo</div>
        <div className="crm-grid">
          {CRM.map((c) => (
            <a key={c.id} className={`lanzadera lz-${c.estilo}`} href={c.url} target="_blank" rel="noopener noreferrer">
              <span className="icono">{c.icono}</span>
              <span className="textos">
                <span className="etiqueta">{c.etiqueta}</span>
                <h3>{c.nombre}</h3>
                <span className="desc">{c.desc}</span>
              </span>
              <span className="ir"><FlechaIcono /></span>
            </a>
          ))}
        </div>
      </section>

      {(accesosRapidos.favs.length > 0 || accesosRapidos.recientesItems.length > 0) && (
        <section className="crm-wrap">
          {accesosRapidos.favs.length > 0 && (
            <>
              <div className="crm-titulo">⭐ Tus favoritos</div>
              <div className="grid" style={{ marginBottom: accesosRapidos.recientesItems.length > 0 ? 34 : 0 }}>
                {accesosRapidos.favs.map((p) => (
                  <TarjetaProceso key={p.id} p={p} favorito onFavorito={alternarFavorito} onAbrir={registrarReciente} />
                ))}
              </div>
            </>
          )}
          {accesosRapidos.recientesItems.length > 0 && (
            <>
              <div className="crm-titulo">Recientes</div>
              <div className="grid">
                {accesosRapidos.recientesItems.map((p) => (
                  <TarjetaProceso key={p.id} p={p} favorito={false} onFavorito={alternarFavorito} onAbrir={registrarReciente} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="marquee" aria-hidden="true">
        <div className="cinta">
          {Array.from({ length: 6 }).map((_, r) => VALORES.map((v, i) => (
            <span key={`${r}-${i}`}>{v} <b>·</b></span>
          )))}
        </div>
      </div>

      <section className="stats">
        <div className="stat revelar"><Cifra meta={1976} /><div className="texto">Año de fundación</div></div>
        <div className="stat revelar"><Cifra meta={10000} sufijo="+" /><div className="texto">Viviendas vendidas</div></div>
        <div className="stat revelar"><Cifra meta={20000} sufijo="+" /><div className="texto">Familias atendidas</div></div>
        <div className="stat revelar"><Cifra meta={todos.length} /><div className="texto">Procesos en la BASE</div></div>
      </section>

      <div className="cats-sticky">
        <nav className="cats" aria-label="Categorías">
          {['TODOS', ...CATEGORIAS_BASE].map((c) => (
            <button
              key={c}
              className={`cat-pill${filtroCat === c ? ' activa' : ''}`}
              onClick={() => setFiltroCat(c)}
            >
              {c === 'TODOS' ? 'Todos' : c}
            </button>
          ))}
        </nav>
      </div>

      <main>
        {secciones.length === 0 && (
          <div className="seccion">
            <div className="vacio">
              No hay resultados para esa búsqueda.<br />
              Prueba con otra palabra, o si echas en falta un proceso, <strong>coméntaselo a Almudena</strong>.
            </div>
          </div>
        )}
        {secciones.map((s) => (
          <section className="seccion revelar" key={s.cat}>
            <div className="seccion-cab">
              <span className="num">{String(s.idx + 1).padStart(2, '0')}</span>
              <h2>{s.cat}</h2>
              <span className="cuenta">{s.items.length}</span>
            </div>
            <div className="grid">
              {s.items.map((p) => (
                <TarjetaProceso
                  key={p.id}
                  p={p}
                  favorito={favoritos.has(p.id)}
                  onFavorito={alternarFavorito}
                  onAbrir={registrarReciente}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <section className="banda revelar">
        <Astronauta className="astro-mini" />
        <h2>¿Echas en falta algún proceso? <em>Coméntanoslo.</em></h2>
        <p>La BASE crece con el equipo. Si usas un trámite, un formulario o una herramienta que no está aquí, dínoslo y lo añadimos para todos.</p>
        <a className="btn-add" href={SLACK_ALMUDENA} target="_blank" rel="noopener noreferrer">
          💬 Escribir a Almudena
        </a>
      </section>

      <footer>
        <p className="firma">RK Palanca Fontestad <b>·</b> No vendemos casas, gestionamos momentos vitales <b>·</b> BASE operativa interna</p>
      </footer>
    </>
  )
}
