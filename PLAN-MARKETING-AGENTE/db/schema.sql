-- =====================================================================
-- Plan de Marketing del Agente Inmobiliario — Esquema relacional (Postgres)
-- Pensado para Neon (serverless Postgres) + Vercel Functions, mismo patrón
-- de despliegue que el resto de apps (BASE, ADITI): push a main = deploy.
--
-- Alcance reducido a propósito: solo el catálogo de acciones (M2/M3) y el
-- plan trimestral de cada agente, más el repositorio de recursos. Sin
-- registro de contactos, tareas ni puntos.
-- =====================================================================

CREATE TYPE maquina_tipo AS ENUM ('M2', 'M3');

-- ---------------------------------------------------------------------
-- Agentes (perfil creado automáticamente en el primer login con Google)
-- ---------------------------------------------------------------------
CREATE TABLE agentes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  telefono        TEXT,
  oficina         TEXT,
  avatar_url      TEXT,
  es_admin        BOOLEAN NOT NULL DEFAULT false, -- ve y gestiona el plan de todos los agentes
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Catálogo de acciones (el "menú" M2 / M3)
-- ---------------------------------------------------------------------
CREATE TABLE acciones_catalogo (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo                TEXT UNIQUE NOT NULL, -- ej. "M2-BUZONEO"
  nombre                TEXT NOT NULL,
  maquina               maquina_tipo NOT NULL,
  categoria             TEXT NOT NULL, -- buzoneo, revista, comercios aliados, farming, eventos, colaboradores...
  descripcion           TEXT,
  publico_objetivo_sugerido TEXT,
  frecuencia_sugerida   TEXT, -- texto libre: "mensual", "trimestral"...
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
-- Repositorio de herramientas (guías, dossiers, certificados, plantillas)
-- ---------------------------------------------------------------------
CREATE TABLE recursos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            TEXT NOT NULL,
  categoria         TEXT NOT NULL, -- "Certificado", "Dossier", "Plantilla"...
  tipo              TEXT NOT NULL, -- pdf, docx, link, imagen...
  url               TEXT NOT NULL,
  descripcion       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
