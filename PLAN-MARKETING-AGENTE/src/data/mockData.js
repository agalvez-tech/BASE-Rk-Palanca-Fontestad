// Datos de ejemplo con la misma forma que las tablas de db/schema.sql.
// En producción esto vendría de /api (Vercel Functions) leyendo Postgres.

export const AGENTE_DEMO = {
  id: 'agt-1',
  nombre: 'Agente demo',
}

// ---------------------------------------------------------------------
// Catálogo de acciones — ver db/schema.sql: acciones_catalogo
// 7 categorías, tal como se usan en RK Palanca.
// ---------------------------------------------------------------------
export const ACCIONES_CATALOGO_DEMO = [
  { id: 'ac1', codigo: 'REDES-SOCIALES', nombre: 'Redes sociales', maquina: 'M3', categoria: 'Redes sociales', descripcion: 'Publica contenido de valor (mercado, consejos, casos de éxito) para mantener visibilidad ante tu círculo y tu zona.' },
  { id: 'ac2', codigo: 'PROSPECCION', nombre: 'Prospección', maquina: 'M2', categoria: 'Prospección', descripcion: 'Búsqueda activa de nuevos contactos y propietarios: puerta fría, encuestas de zona, llamadas, buzoneo...' },
  { id: 'ac3', codigo: 'COMERCIO-FIRMA-ACUERDO', nombre: 'Firma de acuerdo', maquina: 'M2', categoria: 'Comercio Aliado', descripcion: 'Cierra el acuerdo de colaboración con el comercio: qué aporta cada parte y cómo se reparte el beneficio.' },
  { id: 'ac4', codigo: 'COMERCIO-CARA-A-CARA', nombre: 'Cara a cara', maquina: 'M2', categoria: 'Comercio Aliado', descripcion: 'Visita presencial al comercio para presentarte, conocer al dueño y proponer la colaboración.' },
  { id: 'ac5', codigo: 'COMERCIO-SEGUIMIENTO', nombre: 'Seguimiento', maquina: 'M2', categoria: 'Comercio Aliado', descripcion: 'Mantén el contacto periódico con el comercio aliado: reposición de material, cómo va todo, nuevas ideas.' },
  { id: 'ac6', codigo: 'COMERCIO-VIDEO', nombre: 'Vídeo de grabación', maquina: 'M2', categoria: 'Comercio Aliado', descripcion: 'Graba un vídeo con el comercio aliado para reforzar la colaboración en redes sociales.' },
  { id: 'ac7', codigo: 'WINWIN-FIRMA-ACUERDO', nombre: 'Firma de acuerdo', maquina: 'M3', categoria: 'Win Win', descripcion: 'Formaliza la colaboración firmando el Certificado Win-Win: el colaborador recibe el 15% de la comisión de cada cliente referido que cierre operación.' },
  { id: 'ac8', codigo: 'WINWIN-CARA-A-CARA', nombre: 'Cara a cara', maquina: 'M3', categoria: 'Win Win', descripcion: 'Presenta el programa Win-Win en persona a un profesional (notaría, gestoría, banco...) usando el dossier oficial.' },
  { id: 'ac9', codigo: 'WINWIN-SEGUIMIENTO', nombre: 'Seguimiento', maquina: 'M3', categoria: 'Win Win', descripcion: 'Mantén el contacto con el colaborador Win-Win: informa del estado de sus referidos y agradece su colaboración.' },
  { id: 'ac10', codigo: 'AREA-INFLUENCIA', nombre: 'Área de Influencia', maquina: 'M3', categoria: 'Área de Influencia', descripcion: 'Acciones dirigidas a tu círculo de influencia: familia, amigos, antiguos clientes y contactos cercanos.' },
  { id: 'ac11', codigo: 'EVENTOS', nombre: 'Eventos', maquina: 'M3', categoria: 'Eventos', descripcion: 'Organiza o participa en un evento (seminario, microevento, curso) para generar contacto directo con tu lista o tu zona.' },
  { id: 'ac12', codigo: 'DESCUBRIR-VENDEDORES', nombre: 'Descubrir vendedores de compradores', maquina: 'M3', categoria: 'Descubrir vendedores de compradores', descripcion: 'Al atender a un comprador, pregúntale si también tiene una propiedad que vender: 1 de cada 10 compradores también vende.' },
]

// Plan de marketing del agente demo, con 3 acciones ya elegidas.
// Sin fecha ni trimestre: es un plan continuo, no periódico.
export const PLAN_TRIMESTRAL_DEMO = {
  id: 'plan-1',
  estado: 'activo',
  acciones: [
    { id: 'pa1', accion_catalogo_id: 'ac2', dirigido_a: 'Zona Russafa', frecuencia: 'Mensual', personalizacion: 'Carta con firma manuscrita + código QR a valoración gratuita' },
    { id: 'pa2', accion_catalogo_id: 'ac10', dirigido_a: 'Clientes cerrados últimos 3 años', frecuencia: 'Cada 2 semanas', personalizacion: 'Guion pidiendo 1 referido concreto por llamada' },
    { id: 'pa3', accion_catalogo_id: 'ac8', dirigido_a: 'Notarías y gestorías de la zona', frecuencia: 'Trimestral', personalizacion: 'Reunión + entrega del dossier Win-Win' },
  ],
}

// ---------------------------------------------------------------------
// Repositorio de herramientas — ver db/schema.sql: recursos
// ---------------------------------------------------------------------
export const RECURSOS_DEMO = [
  { id: 'r1', titulo: 'Certificado Win-Win (15%)', categoria: 'Certificado', tipo: 'docx', url: '/recursos/certificado-win-win-15.docx' },
  { id: 'r2', titulo: 'Dossier Win-Win para profesionales', categoria: 'Dossier', tipo: 'pdf', url: '/recursos/dossier-win-win-profesionales.pdf' },
  { id: 'r3', titulo: 'Plan Inolvidable (guía completa)', categoria: 'Guía', tipo: 'pdf', url: '/recursos/plan-inolvidable.pdf' },
  { id: 'r4', titulo: 'Guía del vendedor 2026', categoria: 'Guía', tipo: 'pdf', url: '/recursos/guia-vendedor-2026.pdf' },
  { id: 'r5', titulo: 'Guía de herencias 2025', categoria: 'Guía', tipo: 'pdf', url: '/recursos/guia-herencias-2025.pdf' },
  { id: 'r6', titulo: 'Revista Cambio de Casa', categoria: 'Guía', tipo: 'pdf', url: '/recursos/revista-cambio-de-casa.pdf' },
]
