import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { CATEGORIAS_BASE, PROCESOS_BASE, CRM } from './data.js'
import Astronauta from './Astronauta.jsx'

const KEY = 'rk_base_procesos_v1'
const VALORES = ['Fuerza', 'Compromiso', 'Unión', 'Crecimiento', 'Inolvidable', 'Tradición + Innovación']

/* ---------- persistencia (localStorage) ---------- */
function cargarCustom() {
  try {
    const v = localStorage.getItem(KEY)
    if (v) return JSON.parse(v)
  } catch (e) { /* sin almacenamiento disponible */ }
  return []
}
function guardarCustom(lista) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista))
    return true
  } catch (e) {
    return false
  }
}

/* ---------- hooks de presentación ---------- */
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
const MasIcono = () => (
  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2H9v5a1 1 0 1 1-2 0V9H2a1 1 0 1 1 0-2h5V2a1 1 0 0 1 1-1z" /></svg>
)

/* ---------- App ---------- */
export default function App() {
  const [custom, setCustom] = useState(cargarCustom)
  const [filtroCat, setFiltroCat] = useState('TODOS')
  const [filtroTexto, setFiltroTexto] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [toast, setToast] = useState('')
  const [topbarPegada, setTopbarPegada] = useState(false)
  const buscadorRef = useRef(null)
  const toastTimer = useRef(null)

  /* formulario */
  const [fNombre, setFNombre] = useState('')
  const [fUrl, setFUrl] = useState('')
  const [fCat, setFCat] = useState(CATEGORIAS_BASE[0])
  const [fNuevaCat, setFNuevaCat] = useState('')
  const [fTipo, setFTipo] = useState('APP')
  const [fDesc, setFDesc] = useState('')
  const [errorForm, setErrorForm] = useState('')

  const estrellas = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: (Math.random() * 2 + 1).toFixed(1),
    d: (Math.random() * 3 + 2).toFixed(1),
    r: (Math.random() * 4).toFixed(1),
    o: (Math.random() * 0.5 + 0.3).toFixed(2),
  })), [])

  const todos = useMemo(() => ([
    ...PROCESOS_BASE.map((p, i) => ({ ...p, id: 'base-' + i, esCustom: false })),
    ...custom.map((p) => ({ ...p, esCustom: true })),
  ]), [custom])

  const categorias = useMemo(() => {
    const extra = custom.map((p) => p.cat).filter((c) => !CATEGORIAS_BASE.includes(c))
    return [...CATEGORIAS_BASE, ...new Set(extra)]
  }, [custom])

  const filtrados = useMemo(() => {
    const t = filtroTexto.trim().toLowerCase()
    return todos.filter((p) => {
      const okCat = filtroCat === 'TODOS' || p.cat === filtroCat
      const okTxt = !t || `${p.nombre} ${p.desc || ''} ${p.cat} ${p.tipo}`.toLowerCase().includes(t)
      return okCat && okTxt
    })
  }, [todos, filtroCat, filtroTexto])

  const secciones = useMemo(
    () => categorias
      .filter((c) => filtrados.some((p) => p.cat === c))
      .map((c, idx) => ({ cat: c, idx, items: filtrados.filter((p) => p.cat === c) })),
    [categorias, filtrados],
  )

  useRevelar([secciones])

  /* topbar y atajo de teclado */
  useEffect(() => {
    const onScroll = () => setTopbarPegada(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    const onKey = (e) => {
      if (e.key === 'Escape') setModalAbierto(false)
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

  const avisar = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2400)
  }, [])

  const abrirModal = () => {
    setFNombre(''); setFUrl(''); setFCat(categorias[0]); setFNuevaCat(''); setFTipo('APP'); setFDesc(''); setErrorForm('')
    setModalAbierto(true)
  }

  const guardarProceso = () => {
    const nombre = fNombre.trim()
    let url = fUrl.trim()
    const cat = fCat === '__NUEVA__' ? fNuevaCat.trim() : fCat
    if (!nombre || !url || !cat) {
      setErrorForm('El nombre, el enlace y la categoría son obligatorios.')
      return
    }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    try { new URL(url) } catch {
      setErrorForm('El enlace no parece una URL válida.')
      return
    }
    const nuevo = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      nombre, url, cat, tipo: fTipo, desc: fDesc.trim(),
    }
    const lista = [...custom, nuevo]
    setCustom(lista)
    const ok = guardarCustom(lista)
    setModalAbierto(false)
    avisar(ok ? 'Proceso añadido a la BASE 🚀' : 'Añadido (no se pudo guardar de forma permanente)')
  }

  const borrarProceso = (e, p) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`¿Eliminar "${p.nombre}" de la BASE?`)) return
    const lista = custom.filter((x) => x.id !== p.id)
    setCustom(lista)
    guardarCustom(lista)
    avisar('Proceso eliminado')
  }

  return (
    <>
      <header className={`topbar${topbarPegada ? ' pegada' : ''}`}>
        <a className="marca" href="#top">
          <img className="logo-topbar" src="/logo-horiz-negro.png" alt="RK Palanca Fontestad · by Realmark Inmobiliaria" />
        </a>
        <button className="btn-add" onClick={abrirModal}><MasIcono /> Añadir proceso</button>
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
          {['TODOS', ...categorias].map((c) => (
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
              Prueba con otra palabra o añade el proceso con el botón <strong>Añadir proceso</strong>.
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
                <a className="card" key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                  <div className="fila">
                    <span className="badge">{p.tipo}</span>
                    <span className="flecha"><FlechaIcono /></span>
                  </div>
                  <h3>{p.nombre}</h3>
                  {p.desc && <p>{p.desc}</p>}
                  {p.esCustom && (
                    <button className="borrar" title="Eliminar este proceso" aria-label="Eliminar" onClick={(e) => borrarProceso(e, p)}>×</button>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>

      <section className="banda revelar">
        <Astronauta className="astro-mini" />
        <h2>¿Falta un proceso? <em>Hazlo crecer.</em></h2>
        <p>La BASE es de todo el equipo. Si usas un trámite, un formulario o una herramienta que no está aquí, añádela y estará disponible al instante.</p>
        <button className="btn-add" onClick={abrirModal}><MasIcono /> Añadir proceso</button>
      </section>

      <footer>
        <p className="firma">RK Palanca Fontestad <b>·</b> No vendemos casas, gestionamos momentos vitales <b>·</b> BASE operativa interna</p>
      </footer>

      {modalAbierto && (
        <div className="modal-fondo abierto" role="dialog" aria-modal="true" aria-labelledby="modalTitulo" onClick={(e) => { if (e.target.classList.contains('modal-fondo')) setModalAbierto(false) }}>
          <div className="modal">
            <h2 id="modalTitulo">Añadir un proceso</h2>
            <p className="nota">El proceso quedará guardado en esta BASE.</p>
            <div className="campo">
              <label htmlFor="fNombre">Nombre del proceso</label>
              <input id="fNombre" type="text" placeholder="Ej. Hoja de visita digital" maxLength={90} value={fNombre} onChange={(e) => setFNombre(e.target.value)} autoFocus />
            </div>
            <div className="campo">
              <label htmlFor="fUrl">Enlace (URL)</label>
              <input id="fUrl" type="url" placeholder="https://…" value={fUrl} onChange={(e) => setFUrl(e.target.value)} />
            </div>
            <div className="campo">
              <label htmlFor="fCat">Categoría</label>
              <select id="fCat" value={fCat} onChange={(e) => setFCat(e.target.value)}>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__NUEVA__">+ Nueva categoría…</option>
              </select>
            </div>
            {fCat === '__NUEVA__' && (
              <div className="campo">
                <label htmlFor="fNuevaCat">Nombre de la nueva categoría</label>
                <input id="fNuevaCat" type="text" placeholder="Ej. Postventa" maxLength={40} value={fNuevaCat} onChange={(e) => setFNuevaCat(e.target.value)} />
              </div>
            )}
            <div className="campo">
              <label htmlFor="fTipo">Tipo</label>
              <select id="fTipo" value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
                <option value="APP">App / Web</option>
                <option value="DOC">Documento</option>
                <option value="FORM">Formulario</option>
                <option value="NOTEBOOK">NotebookLM</option>
                <option value="GEM">Gem (Gemini)</option>
                <option value="GPT">GPT</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="fDesc">Descripción breve (opcional)</label>
              <textarea id="fDesc" placeholder="Para qué sirve y cuándo usarlo" maxLength={180} value={fDesc} onChange={(e) => setFDesc(e.target.value)} />
            </div>
            {errorForm && <p className="error-form" style={{ display: 'block' }}>{errorForm}</p>}
            <div className="modal-acciones">
              <button className="btn-sec" onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="btn-add" onClick={guardarProceso}>Guardar proceso</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast${toast ? ' visible' : ''}`}>{toast}</div>
    </>
  )
}
