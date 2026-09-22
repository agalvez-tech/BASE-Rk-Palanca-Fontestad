// Datos de ejemplo con la misma forma que las tablas de db/schema.sql.
// En producción esto vendría de /api (Vercel Functions) leyendo Postgres.

export const AGENTE_DEMO = {
  id: 'agt-1',
  nombre: 'Agente demo',
}

// ---------------------------------------------------------------------
// Catálogo de acciones (el "menú" M2 / M3) — ver db/schema.sql: acciones_catalogo
// ---------------------------------------------------------------------
export const ACCIONES_CATALOGO_DEMO = [
  { id: 'ac1', codigo: 'M2-BUZONEO', nombre: 'Buzoneo de zona', maquina: 'M2', categoria: 'Buzoneo', descripcion: 'Folleto o carta personalizada en buzones de la zona de farming.' },
  { id: 'ac2', codigo: 'M2-REVISTA', nombre: 'Revista de propiedades', maquina: 'M2', categoria: 'Revista', descripcion: 'Distribución de la revista con inmuebles destacados.' },
  { id: 'ac3', codigo: 'M2-COMERCIOS', nombre: 'Comercios aliados', maquina: 'M2', categoria: 'Comercios aliados', descripcion: 'Expositor o acuerdo con comercios de la zona para captar leads.' },
  { id: 'ac4', codigo: 'M2-FARMING', nombre: 'Farming digital', maquina: 'M2', categoria: 'Farming', descripcion: 'Contenido geolocalizado en redes sobre la zona.' },
  { id: 'ac5', codigo: 'M3-EVENTO', nombre: 'Evento con esfera de influencia', maquina: 'M3', categoria: 'Eventos', descripcion: 'Encuentro presencial con clientes pasados y referidos.' },
  { id: 'ac6', codigo: 'M3-REUNION', nombre: 'Reunión individual', maquina: 'M3', categoria: 'Reuniones', descripcion: 'Café o visita 1 a 1 con un referido prioritario.' },
  { id: 'ac7', codigo: 'M3-VIDEO', nombre: 'Vídeo personalizado', maquina: 'M3', categoria: 'Vídeos', descripcion: 'Vídeo corto dirigido a un contacto o grupo concreto.' },
  { id: 'ac8', codigo: 'M3-LLAMADA', nombre: 'Llamada de referidos', maquina: 'M3', categoria: 'Llamadas', descripcion: 'Ronda de llamadas pidiendo referidos a la esfera de influencia.' },
  { id: 'ac9', codigo: 'M3-WINWIN-PRESENTACION', nombre: 'Presentación programa Win-Win', maquina: 'M3', categoria: 'Colaboradores', descripcion: 'Presenta el programa de colaboradores Win-Win a profesionales de tu zona usando el dossier oficial.' },
  { id: 'ac10', codigo: 'M3-WINWIN-CERTIFICADO', nombre: 'Firma de Certificado Win-Win', maquina: 'M3', categoria: 'Colaboradores', descripcion: 'Formaliza la colaboración firmando el Certificado Win-Win: el colaborador recibe el 15% de la comisión de cada cliente referido que cierre operación.' },
]

// Plan trimestral activo del agente demo, con 3 acciones ya configuradas
export const PLAN_TRIMESTRAL_DEMO = {
  id: 'plan-1',
  trimestre: 4,
  anio: 2026,
  estado: 'activo',
  acciones: [
    { id: 'pa1', accion_catalogo_id: 'ac1', dirigido_a: 'Zona Russafa (800 buzones)', frecuencia: 'Mensual', personalizacion: 'Carta con firma manuscrita + código QR a valoración gratuita' },
    { id: 'pa2', accion_catalogo_id: 'ac8', dirigido_a: 'Clientes cerrados últimos 3 años', frecuencia: 'Cada 2 semanas', personalizacion: 'Guion pidiendo 1 referido concreto por llamada' },
    { id: 'pa3', accion_catalogo_id: 'ac9', dirigido_a: 'Notarías y gestorías de la zona', frecuencia: 'Trimestral', personalizacion: 'Reunión + entrega del dossier Win-Win' },
  ],
}

// ---------------------------------------------------------------------
// Repositorio de herramientas — ver db/schema.sql: recursos
// ---------------------------------------------------------------------
export const RECURSOS_DEMO = [
  { id: 'r1', titulo: 'Certificado Win-Win (15%)', categoria: 'Certificado', tipo: 'docx', url: '/recursos/certificado-win-win-15.docx' },
  { id: 'r2', titulo: 'Dossier Win-Win para profesionales', categoria: 'Dossier', tipo: 'pdf', url: '/recursos/dossier-win-win-profesionales.pdf' },
  { id: 'r3', titulo: 'Plan Inolvidable (guía completa)', categoria: 'Guía', tipo: 'pdf', url: '/recursos/plan-inolvidable.pdf' },
  { id: 'r4', titulo: 'Mi Plan RK-Agente (plantilla)', categoria: 'Plantilla', tipo: 'xlsx', url: '/recursos/mi-plan-rk-agente.xlsx' },
  { id: 'r5', titulo: 'Guía del vendedor 2026', categoria: 'Guía', tipo: 'pdf', url: '/recursos/guia-vendedor-2026.pdf' },
  { id: 'r6', titulo: 'Guía de herencias 2025', categoria: 'Guía', tipo: 'pdf', url: '/recursos/guia-herencias-2025.pdf' },
]
