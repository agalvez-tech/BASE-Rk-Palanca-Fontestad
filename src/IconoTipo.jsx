const RUTAS = {
  APP: <polygon points="8.7,1.3 2,9.3 7.3,9.3 6,14.7 14,6.7 8.7,6.7" />,
  DOC: <path d="M11 2l3 3L5 14H2v-3L11 2z" strokeLinejoin="round" />,
  PDF: <path d="M4 1h6l3 3v11H4V1zM10 1v3h3" strokeLinejoin="round" />,
  FORM: <path d="M3 4h2M7 4h6M3 8h2M7 8h6M3 12h2M7 12h6" />,
  GEM: <path d="M8 1l1.4 5.6L15 8l-5.6 1.4L8 15l-1.4-5.6L1 8l5.6-1.4L8 1z" strokeLinejoin="round" />,
  GPT: <path d="M2 3h12v8H6l-3 3v-3H2V3z" strokeLinejoin="round" />,
  NOTEBOOK: <path d="M2.5 3.5h11v9h-11zM8 3.5v9M4.5 6.5h1.5M4.5 9.5h1.5M10 6.5h1.5M10 9.5h1.5" strokeLinejoin="round" />,
  WEB: <><circle cx="8" cy="8" r="6" /><path d="M2 8h12" /><ellipse cx="8" cy="8" rx="2.6" ry="6" /></>,
}

export default function IconoTipo({ tipo }) {
  const ruta = RUTAS[tipo]
  if (!ruta) return null
  const relleno = tipo === 'APP' || tipo === 'GEM'
  return (
    <svg
      className="icono-tipo"
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill={relleno ? 'currentColor' : 'none'}
      stroke={relleno ? 'none' : 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {ruta}
    </svg>
  )
}
