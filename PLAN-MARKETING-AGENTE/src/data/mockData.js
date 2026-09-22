// Datos de ejemplo con la misma forma que las tablas de db/schema.sql.
// En producción esto vendría de /api (Vercel Functions) leyendo Postgres.

export const AGENTE_DEMO = {
  id: 'agt-1',
  nombre: 'Agente demo',
}

// ---------------------------------------------------------------------
// Catálogo de acciones (el "menú" M2 / M3) — ver db/schema.sql: acciones_catalogo
// Fiel al contenido real de la guía "Plan Inolvidable" (ver Recursos), más
// las acciones de colaboradores Win-Win propias de RK Palanca.
// ---------------------------------------------------------------------
export const ACCIONES_CATALOGO_DEMO = [
  // M2 — Zona (farming geográfico)
  { id: 'ac1', codigo: 'M2-BUZONEO-FLYERS', nombre: 'Buzoneo de zona', maquina: 'M2', categoria: 'Buzoneo', descripcion: 'Folleto o carta personalizada en los buzones de tu zona de farming. Combínala con otra acción de más impacto: sola, rinde poco.' },
  { id: 'ac2', codigo: 'M2-ENCUESTA', nombre: 'Encuesta a vecinos del barrio', maquina: 'M2', categoria: 'Zona', descripcion: 'Encuesta puerta a puerta (3-5 preguntas) para detectar vendedores potenciales y abrir conversación. Avisa antes con un folleto.' },
  { id: 'ac3', codigo: 'M2-REVISTA-MANO', nombre: 'Entrega en mano de revista a vendedores en activo', maquina: 'M2', categoria: 'Revista', descripcion: 'Localiza pisos en venta de la zona y entrega la revista en mano junto con tu tarjeta, como excusa de contacto.' },
  { id: 'ac4', codigo: 'M2-REVISTA-BUZON', nombre: 'Entrega en buzón de revista con tarjeta manuscrita', maquina: 'M2', categoria: 'Revista', descripcion: 'Cuando no localizas al vendedor en persona, deja la revista en el buzón con una tarjeta manuscrita.' },
  { id: 'ac5', codigo: 'M2-COMERCIO-ACUERDO', nombre: 'Acuerdo con comercio aliado', maquina: 'M2', categoria: 'Comercios aliados', descripcion: 'Cierra un acuerdo de colaboración con un comercio de la zona: punto de distribución de material, avisador de ventas, o encuestas conjuntas.' },
  { id: 'ac6', codigo: 'M2-REFERIDOR', nombre: 'Acuerdo con referidor profesional', maquina: 'M2', categoria: 'Comercios aliados', descripcion: 'Cierra un acuerdo de referidos con un profesional de tu zona (abogado, banca, asesor, administrador de fincas...) que por su trabajo conoce gente que vende.' },
  { id: 'ac7', codigo: 'M2-COMERCIO-REVISTA', nombre: 'Reposición de revistas en comercio aliado', maquina: 'M2', categoria: 'Comercios aliados', descripcion: 'Vuelve a pasar por el comercio aliado para reponer revistas, tu excusa perfecta para mantener el contacto.' },
  { id: 'ac8', codigo: 'M2-POMERO-VENDE', nombre: 'Pomero "un vecino vende" en el edificio', maquina: 'M2', categoria: 'Cartelería', descripcion: 'Coloca un aviso en el buzón/puerta del edificio donde has captado, avisando de que un vecino vende (principio de aceptación social).' },
  { id: 'ac9', codigo: 'M2-POMERO-VENDIDO', nombre: 'Pomero "VENDIDO" en el edificio', maquina: 'M2', categoria: 'Cartelería', descripcion: 'Avisa a todo el edificio o zona de que has vendido una propiedad, para atraer a los siguientes vendedores.' },
  { id: 'ac10', codigo: 'M2-CARTEL-VENDIDO', nombre: 'Cartel de VENDIDO', maquina: 'M2', categoria: 'Cartelería', descripcion: 'Sustituye el cartel de "se vende" por uno de "vendido" tras cada venta: muestra tu éxito al barrio.' },
  { id: 'ac11', codigo: 'M2-COMUNIDAD', nombre: 'Oficina para comunidad de propietarios', maquina: 'M2', categoria: 'Zona', descripcion: 'Presta tu oficina a una comunidad de propietarios de tu zona para su reunión. Te conocerán todos los vecinos que acudan.' },
  { id: 'ac12', codigo: 'M2-EVENTO-ZONA', nombre: 'Evento o curso para vecinos de zona', maquina: 'M2', categoria: 'Zona', descripcion: 'Organiza una charla o taller (tecnología, branding, temas fiscales...) para acercar a los vecinos a tu oficina.' },
  { id: 'ac13', codigo: 'M2-VECINO-EDIFICIO', nombre: 'Conseguir un vecino de contacto por edificio', maquina: 'M2', categoria: 'Zona', descripcion: 'Identifica a una persona influyente (presidente, vecino conectado) en cada edificio que te avise cuando alguien venda.' },
  { id: 'ac14', codigo: 'M2-FURGONETA', nombre: 'Furgoneta en zona', maquina: 'M2', categoria: 'Zona', descripcion: 'Aparca la furgoneta de la marca en puntos de alta visibilidad de tu zona (supermercado, colegio, mercado) y cámbiala de sitio cada semana.' },

  // M3 — Esfera de influencia (farming referencial)
  { id: 'ac15', codigo: 'M3-POST', nombre: 'Post en redes sociales', maquina: 'M3', categoria: 'Redes sociales', descripcion: 'Publica contenido de valor para propietarios (ahorro energético, fiscalidad, mantenimiento...) dirigido a tu círculo de influencia.' },
  { id: 'ac16', codigo: 'M3-NEWSLETTER', nombre: 'Newsletter por email', maquina: 'M3', categoria: 'Redes sociales', descripcion: 'Envía una newsletter mensual con contenido de interés para propietarios a tu lista de contactos.' },
  { id: 'ac17', codigo: 'M3-VIDEO-PROPIO', nombre: 'Vídeo propio (whatsapp o RRSS)', maquina: 'M3', categoria: 'Vídeos', descripcion: 'Graba un vídeo corto (menos de 2 min) con tu cara sobre un tema de interés y envíalo por whatsapp o redes. El impacto de la cara propia es mucho mayor que un vídeo genérico.' },
  { id: 'ac18', codigo: 'M3-VIDEO-BLOG', nombre: 'Vídeo o post reutilizado', maquina: 'M3', categoria: 'Vídeos', descripcion: 'Reutiliza un vídeo o artículo del blog general de la marca, compartiéndolo con un comentario personal.' },
  { id: 'ac19', codigo: 'M3-LLAMADA-CONVOCATORIA', nombre: 'Llamada de convocatoria a evento', maquina: 'M3', categoria: 'Llamadas', descripcion: 'Llama a tu lista para invitarles a un seminario o microevento. La llamada aumenta mucho la probabilidad de asistencia frente al flyer.' },
  { id: 'ac20', codigo: 'M3-LLAMADA-AGRADECIMIENTO', nombre: 'Llamada de agradecimiento tras el evento', maquina: 'M3', categoria: 'Llamadas', descripcion: 'Agradece por teléfono la asistencia a quienes vinieron a tu evento. Es un momento perfecto para pedir referidos.' },
  { id: 'ac21', codigo: 'M3-LLAMADA-CORTESIA', nombre: 'Llamada de cortesía a tu lista', maquina: 'M3', categoria: 'Llamadas', descripcion: 'Llama a alguien de tu círculo solo para saludar y retomar el contacto, sin pedir nada.' },
  { id: 'ac22', codigo: 'M3-SEMINARIO', nombre: 'Seminario a lista de propietarios', maquina: 'M3', categoria: 'Eventos', descripcion: 'Organiza un seminario (no necesariamente sobre vender) para tu lista de propietarios, con aforo máximo de 24 personas.' },
  { id: 'ac23', codigo: 'M3-BEER-TRAINING', nombre: 'Sesión "Beer & training"', maquina: 'M3', categoria: 'Eventos', descripcion: 'Sesión formativa breve en tu oficina para profesionales y comercios aliados (tecnología, marketing, negociación...).' },
  { id: 'ac24', codigo: 'M3-MICROEVENTO', nombre: 'Microevento a mi lista', maquina: 'M3', categoria: 'Eventos', descripcion: 'Evento informal en la oficina (15-20 asistentes) sobre una temática de interés para tu círculo. Convoca 15 y 7 días antes, y confirma por llamada 2-3 días antes.' },
  { id: 'ac25', codigo: 'M3-REENCUENTRO', nombre: 'Reencuentro con contactos recuperados', maquina: 'M3', categoria: 'Eventos', descripcion: 'Organiza una comida o cena de reencuentro con contactos con los que llevas más de un año sin hablar.' },
  { id: 'ac26', codigo: 'M3-EVENTO-CLIENTES', nombre: 'Evento de agradecimiento a clientes pasados', maquina: 'M3', categoria: 'Eventos', descripcion: 'Evento (normalmente gastronómico) dirigido solo a antiguos clientes, como fidelización.' },
  { id: 'ac27', codigo: 'M3-FELICITACION', nombre: 'Felicitación a mi lista', maquina: 'M3', categoria: 'Detalles', descripcion: 'Felicita cumpleaños u otras fechas señaladas a tu lista y antiguos clientes: por email, whatsapp, vídeo o llamada según el impacto que busques.' },
  { id: 'ac28', codigo: 'M3-REGALO', nombre: 'Regalo a contactos de la lista', maquina: 'M3', categoria: 'Detalles', descripcion: 'Un pequeño detalle (calendario, llavero...) para que tu contacto y tus datos se queden en su casa todo el año.' },

  // M3 — Condicionadas (se disparan al cumplirse un hito)
  { id: 'ac29', codigo: 'M3-COND-FOTO-AGENTE', nombre: 'Foto de firma en notaría (la subes tú)', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Súbela a tus redes tras cada firma: muestra tu actividad real a tu círculo de influencia.' },
  { id: 'ac30', codigo: 'M3-COND-FOTO-CLIENTE', nombre: 'Foto de firma en notaría (la sube el cliente)', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Consigue que sea el propio cliente quien comparta la foto en sus redes. El impacto es mucho mayor que si la subes tú.' },
  { id: 'ac31', codigo: 'M3-COND-TESTIMONIO', nombre: 'Testimonio en vídeo del cliente', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Pide al cliente un vídeo breve contando su experiencia, para tus redes o para las suyas.' },
  { id: 'ac32', codigo: 'M3-COND-VENDEDOR-OCULTO', nombre: 'Descubrir vendedores entre compradores', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Al asesorar a un comprador en gastos e hipoteca, pregunta si tiene una propiedad que vender: 1 de cada 10 compradores también vende.' },
  { id: 'ac33', codigo: 'M3-COND-NOTA-MANO', nombre: 'Nota a mano a los 7 días tras la venta', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Envía una nota de agradecimiento escrita a mano una semana después de la firma, cuando el cliente todavía está contando la noticia a su entorno.' },
  { id: 'ac34', codigo: 'M3-COND-REGALO-SORPRESA', nombre: 'Regalo sorpresa tras la firma', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Un detalle inesperado (vino, flores, un libro que sabes que le gusta) cuando el cliente ya no espera nada de ti.' },
  { id: 'ac35', codigo: 'M3-COND-PLAN-COMUNICACION', nombre: 'Plan de comunicación con el vendedor', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Llamadas y actualizaciones periódicas mientras dura el encargo, para que el vendedor nunca sienta que ha perdido el control de su venta.' },
  { id: 'ac36', codigo: 'M3-COND-RECUPERACION', nombre: 'Llamada de recuperación a entrevistas fallidas', maquina: 'M3', categoria: 'Condicionada', descripcion: 'Retoma el contacto con quien no llegaste a convertir en cliente, a los 7, 15, 30 y 60 días. Dando ayuda, no pidiendo.' },

  // M3 — Colaboradores (Win-Win, propio de RK Palanca)
  { id: 'ac37', codigo: 'M3-WINWIN-PRESENTACION', nombre: 'Presentación programa Win-Win', maquina: 'M3', categoria: 'Colaboradores', descripcion: 'Presenta el programa de colaboradores Win-Win a profesionales de tu zona usando el dossier oficial.' },
  { id: 'ac38', codigo: 'M3-WINWIN-CERTIFICADO', nombre: 'Firma de Certificado Win-Win', maquina: 'M3', categoria: 'Colaboradores', descripcion: 'Formaliza la colaboración firmando el Certificado Win-Win: el colaborador recibe el 15% de la comisión de cada cliente referido que cierre operación.' },
]

// Plan trimestral activo del agente demo, con 3 acciones ya configuradas
export const PLAN_TRIMESTRAL_DEMO = {
  id: 'plan-1',
  trimestre: 4,
  anio: 2026,
  estado: 'activo',
  acciones: [
    { id: 'pa1', accion_catalogo_id: 'ac1', dirigido_a: 'Zona Russafa (800 buzones)', frecuencia: 'Mensual', personalizacion: 'Carta con firma manuscrita + código QR a valoración gratuita' },
    { id: 'pa2', accion_catalogo_id: 'ac21', dirigido_a: 'Clientes cerrados últimos 3 años', frecuencia: 'Cada 2 semanas', personalizacion: 'Guion pidiendo 1 referido concreto por llamada' },
    { id: 'pa3', accion_catalogo_id: 'ac37', dirigido_a: 'Notarías y gestorías de la zona', frecuencia: 'Trimestral', personalizacion: 'Reunión + entrega del dossier Win-Win' },
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
]
