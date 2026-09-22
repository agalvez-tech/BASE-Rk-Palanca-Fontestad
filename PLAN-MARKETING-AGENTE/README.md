# Plan de Marketing del Agente Inmobiliario

App enfocada exclusivamente en el **Plan trimestral** del agente (2-4
acciones del catálogo M2/M3, incluidas las de colaboradores Win-Win) y un
**repositorio de recursos** reales para consultarlas. Sin registro de
contactos ni sistema de puntos — se dejaron fuera a propósito.

Mismo patrón que BASE/ADITI: **React + Vite** en el front, **Vercel Functions**
en `api/` y **Postgres (Neon)** como base de datos relacional.

Cada agente entra con su cuenta de Google **@inmobiliariapalanca.com** y ve
solo su propio plan. El primer login crea su perfil automáticamente — no
hace falta alta manual. Login con Google ya probado y funcionando en
producción: https://plan-marketing-agente.vercel.app

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
│   ├── plan.js                    # GET plan activo · POST añadir acción · DELETE quitar acción
│   └── recursos.js                # GET repositorio de recursos (global)
├── src/
│   ├── App.jsx                     # Shell: pantalla de login / demo / app, según el estado de sesión
│   ├── api/client.js               # Cliente fetch + comprobarSesion() (distingue demo/sin-sesión/autenticado)
│   ├── index.css                    # Estilos, identidad RK (Montserrat, naranja #cf731b)
│   ├── data/mockData.js             # Datos de ejemplo (mismo formato que las tablas de db/schema.sql)
│   └── components/
│       ├── Login.jsx                  # Botón "Iniciar sesión con Google" (Google Identity Services)
│       ├── PlanConfigurator.jsx        # Configurador trimestral: elige 2-4 acciones del catálogo
│       └── ResourceRepository.jsx      # Repositorio de recursos (certificado y dossier Win-Win)
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

## Cosas a tener en cuenta

- **Recursos son archivos reales, no enlaces de ejemplo.** El certificado
  Win-Win (`.docx`) y el dossier para profesionales (`.pdf`) viven en
  `public/recursos/` y se sirven como archivos estáticos del propio
  proyecto — no hace falta ningún servicio de almacenamiento externo.
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
