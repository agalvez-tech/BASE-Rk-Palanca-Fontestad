# Plan de Marketing del Agente Inmobiliario

App enfocada exclusivamente en el **Plan trimestral** del agente y un
**repositorio de recursos** reales para consultarlas. Sin registro de
contactos ni sistema de puntos — se dejaron fuera a propósito.

El catálogo de acciones (M2 = zona/farming geográfico, M3 = esfera de
influencia/farming referencial, 38 acciones en total) es fiel al contenido
real de la guía **"Plan Inolvidable"** (ver Recursos), más dos acciones de
colaboradores Win-Win propias de RK Palanca.

Mismo patrón que BASE/ADITI: **React + Vite** en el front, **Vercel Functions**
en `api/` y **Postgres (Neon)** como base de datos relacional.

Cada agente entra con su cuenta de Google **@inmobiliariapalanca.com** y ve
solo su propio plan. El primer login crea su perfil automáticamente — no
hace falta alta manual. Un agente marcado como **administrador** (hoy,
`agalvez@inmobiliariapalanca.com`) tiene además una pestaña "Agentes" con
el plan de todos, y puede ver y editar el de cualquiera. Login con Google
ya probado y funcionando en producción: https://plan-marketing-agente.vercel.app

## Variables de entorno

Ya configuradas en Vercel (development, preview y production) y en
`.env.local`:

| Variable | Qué es |
|---|---|
| `DATABASE_URL` | Conexión a Neon |
| `SESSION_SECRET` | Firma la cookie de sesión |
| `GOOGLE_CLIENT_ID` | Client ID de Google (backend) |
| `VITE_GOOGLE_CLIENT_ID` | Mismo Client ID, expuesto al frontend (no es secreto) |

## Ejecutar en local

Modo demo (solo frontend, datos de ejemplo, sin backend ni login):

```bash
npm install
npm run dev
```

Modo completo (frontend + `/api` + base de datos real + login con Google):

```bash
npm install
npx vercel dev
```

## Estructura

```
├── db/schema.sql               # Esquema relacional (Postgres), aplicado ya en Neon
├── public/recursos/             # Archivos reales del repositorio de recursos (docx, pdf)
├── api/
│   ├── _db.js                    # Cliente Neon + protegido() (exige sesión, aísla datos por agente)
│   ├── _auth.js                   # Cookie de sesión firmada (JWT, biblioteca "jose")
│   ├── auth/
│   │   ├── google.js               # POST: verifica el login de Google y crea/actualiza el perfil
│   │   ├── me.js                   # GET: perfil del agente autenticado (401 si no hay sesión)
│   │   └── logout.js               # POST: borra la cookie de sesión
│   ├── catalogo.js                # GET catálogo de acciones M2/M3 (global, no por agente)
│   ├── plan.js                    # GET/POST/DELETE del plan; admin puede pasar `agente_id` para operar sobre el de otro
│   ├── recursos.js                # GET repositorio de recursos (global)
│   └── admin/
│       └── agentes.js              # GET (solo admin): todos los agentes + resumen de su plan
├── src/
│   ├── App.jsx                     # Shell: pantalla de login / demo / app, según el estado de sesión
│   ├── api/client.js               # Cliente fetch + comprobarSesion() (distingue demo/sin-sesión/autenticado)
│   ├── index.css                    # Estilos, identidad RK (Montserrat, naranja #cf731b)
│   ├── data/mockData.js             # Datos de ejemplo (mismo formato que las tablas de db/schema.sql)
│   └── components/
│       ├── Login.jsx                  # Botón "Iniciar sesión con Google" (Google Identity Services)
│       ├── PlanConfigurator.jsx        # Configurador trimestral: elige 2-4 acciones del catálogo
│       ├── ResourceRepository.jsx      # Repositorio de recursos
│       └── AdminAgentes.jsx            # Solo admin: lista de agentes → ver/editar el plan de cualquiera
```

## Cómo funciona el login

1. El agente pulsa "Iniciar sesión con Google" (`src/components/Login.jsx`,
   Google Identity Services — sin librerías de pago).
2. Google devuelve un token firmado por Google (`credential`) con el email
   ya verificado por ellos.
3. `api/auth/google.js` verifica ese token contra los servidores de Google,
   comprueba que el email termina en `@inmobiliariapalanca.com`, y crea (o
   actualiza) la fila en `agentes` — primer login = alta automática.
4. Se firma una cookie de sesión (HttpOnly, 30 días) con el id del agente.
   Cada función de `api/` la lee con `protegido()` (`api/_db.js`) y filtra
   todo por ese `agente_id`: un agente nunca ve el plan de otro.

## Administradores

`agentes.es_admin` (columna booleana) marca quién ve la pestaña "Agentes"
y puede ver/editar el plan de cualquiera. Hoy solo
`agalvez@inmobiliariapalanca.com` lo es. Para dar de alta a otro
administrador (necesita haber iniciado sesión al menos una vez, para que
su perfil ya exista):

```sql
UPDATE agentes SET es_admin = true WHERE email = 'nuevo-admin@inmobiliariapalanca.com';
```

## Cosas a tener en cuenta

- **Recursos son archivos reales, no enlaces de ejemplo.** Certificado y
  dossier Win-Win, la guía "Plan Inolvidable", y las guías de vendedor y
  de herencias — todos viven en `public/recursos/` (se sacaron de la
  carpeta de Drive de la agencia) y se sirven como archivos estáticos del
  propio proyecto — no hace falta ningún servicio de almacenamiento externo.
- **El catálogo de acciones se reescribió entero** a partir del texto real
  de `public/recursos/plan-inolvidable.pdf` (antes tenía 10 acciones
  genéricas de ejemplo; ahora son 38, fieles a las técnicas descritas en la
  guía: zona/farming geográfico, círculo de influencia/farming referencial,
  y acciones condicionadas a un hito como una firma). Las 8 acciones
  antiguas se desactivaron (`activo = false`) en vez de borrarse, así que
  cualquier plan que ya las tuviera sigue mostrándolas sin romperse.
- **Vercel ya está enlazado** al proyecto `plan-marketing-agente`
  (`almudena-s-projects2`), conectado al repo de GitHub
  `agalvez-tech/BASE-Rk-Palanca-Fontestad`.
- **Base de datos Neon:** proyecto `plan-marketing-agente`
  (`tiny-violet-17698328`), región `eu-central-1`, completamente aislado del
  Neon de producción `palanca` (el ERP real de la agencia, gestionado con
  Prisma — no se tocó).
- **El esquema conserva `contactos`, `tareas_marketing`, `puntos_historial`,
  `automatizaciones` y `automatizacion_tareas` como tablas vacías/sin usar**
  en la base de datos en vivo (no se han borrado, por si se quieren retomar
  más adelante), pero `db/schema.sql` ya no las incluye — es el esquema de
  referencia "hacia delante", sin esas piezas.
- **Los datos de ejemplo pertenecen a un "agente demo"** (`demo@rkpalanca.com`)
  que nunca podrá loguearse de verdad (no es del dominio real). Cada agente
  real empieza con el plan vacío hasta que añade sus propias acciones.
- **`.env.local` está en `.gitignore`.** Nunca se commitea ningún secreto;
  `.env.example` solo tiene placeholders.
