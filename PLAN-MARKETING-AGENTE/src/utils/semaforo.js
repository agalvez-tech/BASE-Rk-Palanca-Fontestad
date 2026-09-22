const MS_DIA = 1000 * 60 * 60 * 24

export function diasDesde(fechaISO) {
  if (!fechaISO) return Infinity
  return Math.floor((Date.now() - new Date(fechaISO).getTime()) / MS_DIA)
}

// Semáforo: verde si va dentro de plazo, ámbar si está cerca del límite,
// rojo si ya se ha pasado del plazo objetivo de contacto.
export function estadoSemaforo(contacto) {
  const dias = diasDesde(contacto.fecha_ultimo_contacto)
  const objetivo = contacto.frecuencia_objetivo_dias
  if (dias > objetivo) return 'rojo'
  if (dias > objetivo * 0.75) return 'ambar'
  return 'verde'
}

export const ETIQUETA_TIPO_CONTACTO = {
  vendedor_potencial: 'Vendedor potencial',
  comprador: 'Comprador',
  referido: 'Referido',
  esfera_influencia: 'Esfera de influencia',
  cliente_pasado: 'Cliente pasado',
}
