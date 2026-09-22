// Datos de ejemplo con la misma forma que las tablas de db/schema.sql.
// En producción esto vendría de /api (Vercel Functions) leyendo Postgres.

export const AGENTE_DEMO = {
  id: 'agt-1',
  nombre: 'Agente demo',
  objetivo_puntos_mensual: 200,
}

export const CONTACTOS_DEMO = [
  { id: 'c1', nombre: 'María Soler', telefono: '600 111 222', tipo: 'referido', prioridad: 'alta', frecuencia_objetivo_dias: 90, fecha_ultimo_contacto: '2026-03-10' },
  { id: 'c2', nombre: 'Javier Ortiz', telefono: '600 222 333', tipo: 'esfera_influencia', prioridad: 'alta', frecuencia_objetivo_dias: 60, fecha_ultimo_contacto: '2026-06-01' },
  { id: 'c3', nombre: 'Carmen Puig', telefono: '600 333 444', tipo: 'cliente_pasado', prioridad: 'media', frecuencia_objetivo_dias: 180, fecha_ultimo_contacto: '2026-01-15' },
  { id: 'c4', nombre: 'Toni Ferrer', telefono: '600 444 555', tipo: 'vendedor_potencial', prioridad: 'alta', frecuencia_objetivo_dias: 30, fecha_ultimo_contacto: '2026-08-20' },
  { id: 'c5', nombre: 'Lucía Gómez', telefono: '600 555 666', tipo: 'referido', prioridad: 'media', frecuencia_objetivo_dias: 90, fecha_ultimo_contacto: '2026-05-05' },
  { id: 'c6', nombre: 'Ana Belda', telefono: '600 666 777', tipo: 'cliente_pasado', prioridad: 'alta', frecuencia_objetivo_dias: 90, fecha_ultimo_contacto: '2026-09-18' },
  { id: 'c7', nombre: 'Rosa Vidal', telefono: '600 777 888', tipo: 'esfera_influencia', prioridad: 'baja', frecuencia_objetivo_dias: 180, fecha_ultimo_contacto: '2026-08-01' },
  { id: 'c8', nombre: 'Pau Martí', telefono: '600 888 999', tipo: 'vendedor_potencial', prioridad: 'media', frecuencia_objetivo_dias: 45, fecha_ultimo_contacto: '2026-09-10' },
]

export const TAREAS_DEMO = [
  { id: 't1', titulo: 'Llamada seguimiento Plan 30-60 (60d)', contacto: 'Ana Belda', fecha_programada: '2026-09-22', estado: 'pendiente', puntos_otorgados: 10 },
  { id: 't2', titulo: 'Post en redes — venta C/ Mayor 12', contacto: null, fecha_programada: '2026-09-22', estado: 'pendiente', puntos_otorgados: 15 },
  { id: 't3', titulo: 'Buzoneo zona Russafa (mensual)', contacto: null, fecha_programada: '2026-09-20', estado: 'completada', puntos_otorgados: 20 },
  { id: 't4', titulo: 'Regalo cliente tras firma', contacto: 'Ana Belda', fecha_programada: '2026-09-18', estado: 'completada', puntos_otorgados: 15 },
]

export const PUNTOS_MES_ACTUAL = 135

// ---------------------------------------------------------------------
// Catálogo de acciones (el "menú" M2 / M3) — ver db/schema.sql: acciones_catalogo
// ---------------------------------------------------------------------
export const ACCIONES_CATALOGO_DEMO = [
  { id: 'ac1', codigo: 'M2-BUZONEO', nombre: 'Buzoneo de zona', maquina: 'M2', categoria: 'Buzoneo', descripcion: 'Folleto o carta personalizada en buzones de la zona de farming.', puntos_valor: 15 },
  { id: 'ac2', codigo: 'M2-REVISTA', nombre: 'Revista de propiedades', maquina: 'M2', categoria: 'Revista', descripcion: 'Distribución de la revista con inmuebles destacados.', puntos_valor: 20 },
  { id: 'ac3', codigo: 'M2-COMERCIOS', nombre: 'Comercios aliados', maquina: 'M2', categoria: 'Comercios aliados', descripcion: 'Expositor o acuerdo con comercios de la zona para captar leads.', puntos_valor: 10 },
  { id: 'ac4', codigo: 'M2-FARMING', nombre: 'Farming digital', maquina: 'M2', categoria: 'Farming', descripcion: 'Contenido geolocalizado en redes sobre la zona.', puntos_valor: 15 },
  { id: 'ac5', codigo: 'M3-EVENTO', nombre: 'Evento con esfera de influencia', maquina: 'M3', categoria: 'Eventos', descripcion: 'Encuentro presencial con clientes pasados y referidos.', puntos_valor: 30 },
  { id: 'ac6', codigo: 'M3-REUNION', nombre: 'Reunión individual', maquina: 'M3', categoria: 'Reuniones', descripcion: 'Café o visita 1 a 1 con un referido prioritario.', puntos_valor: 20 },
  { id: 'ac7', codigo: 'M3-VIDEO', nombre: 'Vídeo personalizado', maquina: 'M3', categoria: 'Vídeos', descripcion: 'Vídeo corto dirigido a un contacto o grupo concreto.', puntos_valor: 15 },
  { id: 'ac8', codigo: 'M3-LLAMADA', nombre: 'Llamada de referidos', maquina: 'M3', categoria: 'Llamadas', descripcion: 'Ronda de llamadas pidiendo referidos a la esfera de influencia.', puntos_valor: 10 },
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
    { id: 'pa3', accion_catalogo_id: 'ac5', dirigido_a: 'Top 20 esfera de influencia', frecuencia: 'Trimestral', personalizacion: 'Desayuno con sorteo de un Certificado Win-Win' },
  ],
}

// ---------------------------------------------------------------------
// Repositorio de herramientas — ver db/schema.sql: recursos
// ---------------------------------------------------------------------
export const RECURSOS_DEMO = [
  { id: 'r1', titulo: 'Guía de herencias 2026', categoria: 'Guía', tipo: 'pdf', url: '#' },
  { id: 'r2', titulo: 'Revista de propiedades — Q4', categoria: 'Revista', tipo: 'pdf', url: '#' },
  { id: 'r3', titulo: 'Certificado Win-Win', categoria: 'Certificado', tipo: 'pdf', url: '#' },
  { id: 'r4', titulo: 'Plantillas post Instagram', categoria: 'Plantilla', tipo: 'link', url: '#' },
  { id: 'r5', titulo: 'Guion llamada de referidos', categoria: 'Guía', tipo: 'pdf', url: '#' },
  { id: 'r6', titulo: 'Plantilla carta buzoneo', categoria: 'Plantilla', tipo: 'link', url: '#' },
]

export const AUTOMATIZACIONES_DEMO = [
  {
    id: 'auto-1',
    nombre: 'Tras firma de venta',
    evento_disparador: 'venta_firmada',
    activo: true,
    tareas: [
      { id: 'at1', titulo: 'Llamada seguimiento (Plan 30-60)', offset_dias: -30, descripcion: '30 días antes de la firma prevista' },
      { id: 'at2', titulo: 'Foto en notaría', offset_dias: 0, descripcion: 'El mismo día de la firma' },
      { id: 'at3', titulo: 'Post en redes sociales', offset_dias: 1, descripcion: 'Al día siguiente de la firma' },
      { id: 'at4', titulo: 'Entregar regalo al cliente', offset_dias: 3, descripcion: '' },
      { id: 'at5', titulo: 'Llamada seguimiento (Plan 30-60)', offset_dias: 60, descripcion: '60 días después de la firma' },
    ],
  },
  {
    id: 'auto-2',
    nombre: 'Tras captación firmada',
    evento_disparador: 'captacion_firmada',
    activo: true,
    tareas: [
      { id: 'bt1', titulo: 'Sesión de fotos profesional', offset_dias: 2, descripcion: '' },
      { id: 'bt2', titulo: 'Publicación en portales', offset_dias: 3, descripcion: '' },
      { id: 'bt3', titulo: 'Llamada de cortesía al propietario', offset_dias: 14, descripcion: 'Cómo va la difusión' },
    ],
  },
]
