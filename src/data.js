export const CATEGORIAS_BASE = [
  'Captación y venta',
  'Alquiler',
  'Fotografía',
  'Conocimiento · NotebookLM',
  'Gems · Gestión y marketing',
  'Entrenamiento · Llamadas y visitas',
  'Ayuda legal · GPTs',
  'Proceso de firma y postventa',
]

export const CRM = [
  {
    id: 'horus',
    etiqueta: 'CRM · Panel RK',
    nombre: 'HORUS',
    desc: 'Tu centro de mando comercial',
    url: 'https://horus.rkpanel.com/',
    estilo: 'horus',
    icono: 'H',
  },
  {
    id: 'iagestion',
    etiqueta: 'CRM · Gestión inmobiliaria',
    nombre: 'IA GESTIÓN',
    desc: 'Cartera, demandas y gestiones',
    url: 'https://app.iagestion.com/administra/',
    estilo: 'iag',
    icono: 'IA',
  },
]

export const PROCESOS_BASE = [
  { cat: 'Captación y venta', tipo: 'APP', nombre: 'Alta de viviendas', url: 'https://captacion2.vercel.app/', desc: 'Proceso completo de alta de un inmueble nuevo en cartera.' },
  { cat: 'Captación y venta', tipo: 'DOC', nombre: 'Exclusiva vendedor', url: 'https://docs.google.com/document/d/1yYGnmdEpcgCSAfO0UFc54XKBycbTSlO4w5oX-_LU1Hw/edit?tab=t.0#heading=h.gjdgxs', desc: 'Contrato de encargo en exclusiva con el propietario vendedor.' },
  { cat: 'Captación y venta', tipo: 'DOC', nombre: 'Oferta de compra', url: 'https://docs.google.com/document/d/1N689jUaNGpDScfbL8SRGydOt9Qu8Rvk7/edit', desc: 'Documento de oferta de compra estándar.' },
  { cat: 'Captación y venta', tipo: 'DOC', nombre: 'Oferta de compra ASICVAL', url: 'https://docs.google.com/document/d/1KRj52EXV8I_A2VG4ZmO7BLXxSnzi03P6/edit', desc: 'Versión de oferta de compra con modelo ASICVAL.' },
  { cat: 'Captación y venta', tipo: 'APP', nombre: 'Formulario arras · Comprador y vendedor', url: 'https://contrato-arras-522842131600.europe-west3.run.app/', desc: 'Genera el contrato de arras con los datos de comprador y vendedor.' },
  { cat: 'Captación y venta', tipo: 'APP', nombre: 'Informe para bajada precio propietarios', url: 'https://informes-de-evaluaci-n.agalvez.workers.dev/', desc: 'Genera el informe de valoración (IRM) con la marca RK a partir del PDF de evaluación.' },

  { cat: 'Captación y venta', tipo: 'DOC', nombre: 'Aceptación del arrendatario · visitas y venta', url: 'https://docs.google.com/document/d/1hrBHr7lgJRMJi4slAyYFYd2_ciNV7KCs/edit#heading=h.gjdgxs', desc: 'Autorización del inquilino actual para realizar visitas y venta del inmueble.' },
    { cat: 'Captación y venta', tipo: 'PDF', nombre: 'Certificado de titularidad · BBVA (reservas)', url: 'https://drive.google.com/file/d/1umduiXpIXQNsjsbsWN1VfkkffByeae5K/view', desc: 'Cuenta para el ingreso de reservas. Titular: Prodeinmo 99 Consultores.' },
  { cat: 'Captación y venta', tipo: 'PDF', nombre: 'Certificado de titularidad · Santander (honorarios)', url: 'https://drive.google.com/file/d/1C0whMraCj8SWhcKGKq1x8Qodh-cYTdXP/view', desc: 'Cuenta para el pago de honorarios. Titular: Prodeinmo 99 Consultores.' },
  { cat: 'Alquiler', tipo: 'DOC', nombre: 'Exclusiva alquiler', url: 'https://docs.google.com/document/d/1McmBFsz7e4liyyJVOw5wURoN7O7v-Rt7/edit', desc: 'Encargo en exclusiva para gestión de alquiler.' },
  { cat: 'Alquiler', tipo: 'DOC', nombre: 'Oferta de alquiler', url: 'https://docs.google.com/document/d/1ckzySAfR5D4UanBibvRSDyXrHCYbyptxUYNIt8UIm50/edit?tab=t.0', desc: 'Documento de oferta de alquiler para inquilinos.' },
  { cat: 'Alquiler', tipo: 'FORM', nombre: 'Formulario alquiler · Propietario', url: 'https://docs.google.com/forms/d/e/1FAIpQLSdz7GAzmIhKVfhntMVBybW5AyeQxhh4AJC7BjqzWOjBYjUtuw/viewform?usp=sf_link', desc: 'Recogida de datos del propietario para gestionar el alquiler.' },
  { cat: 'Alquiler', tipo: 'FORM', nombre: 'Formulario alquiler · Inquilinos', url: 'https://docs.google.com/forms/d/e/1FAIpQLSf1vTpZPTHmTgcuYsGNffh15PeeJEc_n5MaRfSIvKnd5bElqA/viewform?usp=sf_link', desc: 'Recogida de datos y documentación de candidatos inquilinos.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Alquileres', url: 'https://notebooklm.google.com/notebook/886c09d7-a266-4fe6-84f8-1cd312e73965?pli=1', desc: 'Base de conocimiento con toda la operativa de alquileres.' },

  { cat: 'Fotografía', tipo: 'APP', nombre: 'Formulario Solicitud de fotografía', url: 'https://infopalanca.github.io/formulario-reportaje/', desc: 'Solicitud de reportaje fotográfico para un inmueble.' },

  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Conocimiento Inmobiliaria RK Palanca Fontestad', url: 'https://notebooklm.google.com/notebook/53a7e5f1-0e45-4e52-af62-9b82f93f0f24', desc: 'Conocimiento general de la agencia: quiénes somos y cómo trabajamos.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Operativa RK Palanca Fontestad', url: 'https://notebooklm.google.com/notebook/1205e552-281e-4167-baa6-132b0c8ddca3', desc: 'Procesos operativos del día a día de la oficina.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Temas legales', url: 'https://notebooklm.google.com/notebook/41535262-5dde-4b5e-8ccf-66630e8ed62d', desc: 'Consultas y documentación legal de referencia.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Captación RK Palanca Fontestad', url: 'https://notebooklm.google.com/notebook/18d12285-f6eb-4220-80ad-71cdcece13a2', desc: 'Método y materiales de captación de inmuebles.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Compradores', url: 'https://notebooklm.google.com/notebook/50006bb2-ef76-4d09-9d2d-a0a384fdfec8', desc: 'Gestión y acompañamiento de clientes compradores.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Formaciones', url: 'https://notebooklm.google.com/notebook/d07b5695-fe7f-4a8a-9567-f04120a7a94e', desc: 'Material de las formaciones internas del equipo.' },
  { cat: 'Conocimiento · NotebookLM', tipo: 'NOTEBOOK', nombre: 'Obra nueva', url: 'https://notebooklm.google.com/notebook/a695c796-4880-4767-8324-adf31e5f0dc9', desc: 'Conocimiento específico del departamento de obra nueva.' },

  { cat: 'Gems · Gestión y marketing', tipo: 'GEM', nombre: 'Asistente legal', url: 'https://gemini.google.com/gem/5d3a384d500e', desc: 'Resuelve dudas legales del día a día comercial.' },
  { cat: 'Gems · Gestión y marketing', tipo: 'GEM', nombre: 'Descripción de viviendas', url: 'https://gemini.google.com/gem/360bc9e24e5b', desc: 'Redacta descripciones atractivas para los anuncios de inmuebles.' },
  { cat: 'Gems · Gestión y marketing', tipo: 'GEM', nombre: 'Creador de contenido', url: 'https://gemini.google.com/gem/2980ff6ea475', desc: 'Genera contenido de marketing con la voz de la marca.' },
  { cat: 'Gems · Gestión y marketing', tipo: 'GEM', nombre: 'Creador de títulos atractivos', url: 'https://gemini.google.com/gem/6c5ff72408d7', desc: 'Titulares con gancho para anuncios y publicaciones.' },
  { cat: 'Gems · Gestión y marketing', tipo: 'GEM', nombre: 'Creador de prompts', url: 'https://gemini.google.com/gem/0bb9342ef21e', desc: 'Te ayuda a formular mejor cualquier petición a la IA.' },

  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Llamada de captación', url: 'https://gemini.google.com/gem/1I3bINArFJu4Ck5Abyg0_Z8mpqEL771_p?usp=sharing', desc: 'Simulación de llamada a propietario para entrenar la captación.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Reunión de Winwin', url: 'https://gemini.google.com/gem/1mvqNclK_zpASShsaeJ-pvJX4vl4lRaa9?usp=sharing', desc: 'Simulación de la reunión Winwin con el propietario.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Cita de captación', url: 'https://gemini.google.com/gem/1a5tH4miIeaAxVjJIWLhL1GZcwuRYxvHe?usp=sharing', desc: 'Entrenamiento de la cita presencial de captación.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Visita con comprador', url: 'https://gemini.google.com/gem/1M7HteCQaeRr8TzutaJISyqU8bB16MFaO?usp=sharing', desc: 'Simulación de visita a inmueble acompañando a un comprador.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Visita de evaluación', url: 'https://gemini.google.com/gem/872b679074d1', desc: 'Entrenamiento de la visita de evaluación del inmueble.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Operativa comercial', url: 'https://gemini.google.com/gems/edit/e8206f1bba75', desc: 'Repaso y práctica de la operativa comercial completa.' },
  { cat: 'Entrenamiento · Llamadas y visitas', tipo: 'GEM', nombre: 'Obra nueva · Llamada, cita de venta y objeciones', url: 'https://gemini.google.com/gem/1Sg7dVrLubTVocR3A3skwi0hR5N2fbjDv?usp=sharing', desc: 'Simulación específica de obra nueva: llamada, cita de venta y objeciones de contrato.' },

  { cat: 'Ayuda legal · GPTs', tipo: 'GPT', nombre: 'Abogado · Ley de Arrendamientos Urbanos', url: 'https://chatgpt.com/g/g-9MWz3YvPo-abogado-en-ley-de-arrendamientos-urbanos-espana?model=gpt-4o', desc: 'Consultas sobre la LAU y contratos de arrendamiento en España.' },
  { cat: 'Ayuda legal · GPTs', tipo: 'GPT', nombre: 'Asesor AEAT', url: 'https://chatgpt.com/g/g-67324cc744fc8190880065cc444cc8a8-asesor-aeat?model=gpt-5-thinking', desc: 'Dudas fiscales y trámites con la Agencia Tributaria.' },
  { cat: 'Ayuda legal · GPTs', tipo: 'GPT', nombre: 'Asistente IA Gestión', url: 'https://chatgpt.com/g/g-St0AerrNy-asistente-iagestion', desc: 'Soporte sobre el uso del CRM IA Gestión.' },

  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Control de compraventa', url: 'https://docs.google.com/document/d/1bnBIoe1TXv0zy7wR8uOUJFFFLg4SdesZ/edit', desc: 'Checklist completo de la operación: datos de firma, documentación pre-firma, gestión económica y trámites postventa.' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Autorización · Cambio de titular de suministros', url: 'https://docs.google.com/document/d/1cQtRcXNgIeuRbzbdiZjyZhFlCiCRMk0D/edit', desc: 'Agua, luz y gas con domiciliación bancaria a nombre del nuevo titular.' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Autorización · Plusvalía municipal', url: 'https://docs.google.com/document/d/1a1sBnE829MOpUYOMEyNZy_GuGlb7xK9L/edit', desc: 'Presentación del Impuesto sobre el Incremento de Valor de los Terrenos (IIVTNU).' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Autorización · Duplicado del CEE', url: 'https://docs.google.com/document/d/1A_DXUFGOOtGW__wbp2AS4ozeJMEy6gtq/edit', desc: 'Solicitud de duplicado del Certificado de Eficiencia Energética del inmueble.' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Autorización · Certificado de IBI', url: 'https://docs.google.com/document/d/10khxH3CGDG4JfaqmCqB1Uvgrvv8BytVN/edit', desc: 'Acreditación de estar al corriente de pago del IBI ante el Ayuntamiento.' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Liquidación de IBI en notaría', url: 'https://docs.google.com/document/d/1892qsAXZFms0b715BSHeOtWsmPFJHWT0/edit', desc: 'Acuerdo de prorrateo del IBI entre comprador y vendedor.' },
  { cat: 'Proceso de firma y postventa', tipo: 'DOC', nombre: 'Autorización · Visado VPO', url: 'https://docs.google.com/document/d/1_10_QO_MBpxA2HENVTfr8v7CyTGglo8K/edit', desc: 'Tramitación del visado para vivienda de protección pública de promoción privada.' },
]
