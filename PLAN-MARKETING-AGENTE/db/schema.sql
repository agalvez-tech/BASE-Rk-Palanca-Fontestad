-- =====================================================================
-- Plan de Marketing del Agente Inmobiliario — Esquema relacional (Postgres)
-- Pensado para Neon (serverless Postgres) + Vercel Functions, mismo patrón
-- de despliegue que el resto de apps (BASE, ADITI): push a main = deploy.
-- =====================================================================

CREATE TYPE maquina_tipo AS ENUM ('M2', 'M3');
CREATE TYPE prioridad_tipo AS ENUM ('alta', 'media', 'baja');
CREATE TYPE tipo_contacto AS ENUM ('vendedor_potencial', 'comprador', 'referido', 'esfera_influencia', 'cliente_pasado');
CREATE TYPE estado_tarea AS ENUM ('pendiente', 'completada', 'vencida', 'cancelada');
CREATE TYPE evento_hito_tipo AS ENUM ('venta_firmada', 'compra_firmada', 'captacion_firmada', 'aniversario_cliente');

-- ---------------------------------------------------------------------
-- Agentes
-- ---------------------------------------------------------------------
CREATE TABLE agentes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  telefono        TEXT,
  oficina         TEXT,
  avatar_url      TEXT,
  objetivo_puntos_mensual INTEGER NOT NULL DEFAULT 200,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Contactos (esfera de influencia, referidos, clientes pasados...)
-- Base del CRM ligero y del semáforo de cadencia.
-- ---------------------------------------------------------------------
CREATE TABLE contactos (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id               UUID NOT NULL REFERENCES agentes(id) ON DELETE CASCADE,
  nombre                  TEXT NOT NULL,
  telefono                TEXT,
  email                   TEXT,
  tipo                    tipo_contacto NOT NULL DEFAULT 'esfera_influencia',
  prioridad               prioridad_tipo NOT NULL DEFAULT 'media',
  frecuencia_objetivo_dias INTEGER NOT NULL DEFAULT 90, -- cada cuánto hay que contactarlo
  fecha_ultimo_contacto   DATE,
  origen                  TEXT, -- ej. "venta 2024", "vecino zona farming"
  notas                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contactos_agente ON contactos(agente_id);
CREATE INDEX idx_contactos_semaforo ON contactos(agente_id, fecha_ultimo_contacto);

-- ---------------------------------------------------------------------
-- Catálogo de acciones (el "menú" M2 / M3)
-- ---------------------------------------------------------------------
CREATE TABLE acciones_catalogo (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo                TEXT UNIQUE NOT NULL, -- ej. "M2-BUZONEO"
  nombre                TEXT NOT NULL,
  maquina               maquina_tipo NOT NULL,
  categoria             TEXT NOT NULL, -- buzoneo, revista, comercios aliados, farming, eventos, video, llamadas...
  descripcion           TEXT,
  publico_objetivo_sugerido TEXT,
  frecuencia_sugerida   TEXT, -- texto libre: "mensual", "trimestral"...
  puntos_valor          INTEGER NOT NULL DEFAULT 10, -- puntos "Inolvidable" al completarla
  activo                BOOLEAN NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------
-- Plan trimestral del agente (2-4 acciones elegidas)
-- ---------------------------------------------------------------------
CREATE TABLE planes_trimestrales (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id     UUID NOT NULL REFERENCES agentes(id) ON DELETE CASCADE,
  trimestre     SMALLINT NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
  anio          SMALLINT NOT NULL,
  estado        TEXT NOT NULL DEFAULT 'activo', -- activo, cerrado
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (agente_id, trimestre, anio)
);

-- Acciones concretas dentro de un plan (join table configurable)
CREATE TABLE plan_acciones (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id               UUID NOT NULL REFERENCES planes_trimestrales(id) ON DELETE CASCADE,
  accion_catalogo_id    UUID NOT NULL REFERENCES acciones_catalogo(id),
  dirigido_a            TEXT NOT NULL, -- "a quién se dirige"
  frecuencia            TEXT NOT NULL, -- "cada 2 semanas", "1 vez al mes"...
  personalizacion       TEXT,          -- cómo se personaliza
  activo                BOOLEAN NOT NULL DEFAULT true,
  CHECK (dirigido_a <> '')
);
CREATE INDEX idx_plan_acciones_plan ON plan_acciones(plan_id);

-- ---------------------------------------------------------------------
-- Automatizaciones (workflows condicionados a un hito)
-- Plantilla reutilizable: define qué tareas se generan y con qué offset
-- de días respecto a la fecha del evento disparador (Plan 30-60 incluido).
-- ---------------------------------------------------------------------
CREATE TABLE automatizaciones (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id         UUID REFERENCES agentes(id) ON DELETE CASCADE, -- NULL = plantilla global de oficina
  nombre            TEXT NOT NULL,
  evento_disparador evento_hito_tipo NOT NULL,
  activo            BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE automatizacion_tareas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automatizacion_id UUID NOT NULL REFERENCES automatizaciones(id) ON DELETE CASCADE,
  titulo            TEXT NOT NULL, -- "Foto en notaría", "Post en redes", "Llamada seguimiento 30d"...
  descripcion       TEXT,
  offset_dias       INTEGER NOT NULL, -- negativo = antes del hito (Plan 30-60), positivo = después
  orden             SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_automatizacion_tareas ON automatizacion_tareas(automatizacion_id);

-- Eventos hito reales (ej. una venta que se firma) que disparan una automatización
CREATE TABLE eventos_hito (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id             UUID NOT NULL REFERENCES agentes(id) ON DELETE CASCADE,
  contacto_id           UUID REFERENCES contactos(id),
  tipo_evento           evento_hito_tipo NOT NULL,
  fecha_evento          DATE NOT NULL,
  propiedad_direccion   TEXT,
  automatizacion_id     UUID REFERENCES automatizaciones(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Tareas de marketing (instancias reales: manuales, del plan o generadas
-- automáticamente a partir de un evento_hito + automatizacion_tareas)
-- ---------------------------------------------------------------------
CREATE TABLE tareas_marketing (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id           UUID NOT NULL REFERENCES agentes(id) ON DELETE CASCADE,
  contacto_id         UUID REFERENCES contactos(id),
  plan_accion_id      UUID REFERENCES plan_acciones(id),
  evento_hito_id      UUID REFERENCES eventos_hito(id),
  titulo              TEXT NOT NULL,
  descripcion         TEXT,
  fecha_programada    DATE NOT NULL,
  fecha_completada    TIMESTAMPTZ,
  estado              estado_tarea NOT NULL DEFAULT 'pendiente',
  puntos_otorgados    INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_tareas_agente_estado ON tareas_marketing(agente_id, estado, fecha_programada);

-- ---------------------------------------------------------------------
-- Puntos "Inolvidable" (histórico, permite recalcular barra de progreso
-- y rachas sin recontar tareas cada vez)
-- ---------------------------------------------------------------------
CREATE TABLE puntos_historial (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id   UUID NOT NULL REFERENCES agentes(id) ON DELETE CASCADE,
  tarea_id    UUID REFERENCES tareas_marketing(id),
  puntos      INTEGER NOT NULL,
  motivo      TEXT NOT NULL,
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX idx_puntos_agente_fecha ON puntos_historial(agente_id, fecha);

-- ---------------------------------------------------------------------
-- Repositorio de herramientas (guías, revistas, certificados, plantillas)
-- ---------------------------------------------------------------------
CREATE TABLE recursos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            TEXT NOT NULL,
  categoria         TEXT NOT NULL, -- "Guía", "Revista", "Certificado Win-Win", "Plantilla RRSS"
  tipo              TEXT NOT NULL, -- pdf, link, imagen...
  url               TEXT NOT NULL,
  descripcion       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
