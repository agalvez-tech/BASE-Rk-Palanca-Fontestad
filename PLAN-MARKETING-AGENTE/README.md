# Plan de Marketing del Agente Inmobiliario

MVP del sistema de prospección y referidos (máquinas M2/M3) para agentes RK.
Mismo patrón que BASE/ADITI: **React + Vite** en el front, **Vercel Functions**
en `api/` y **Postgres (Neon)** como base de datos relacional.

Cada agente entra con su cuenta de Google **@inmobiliariapalanca.com** y ve
solo sus propios contactos, tareas, plan y puntos. El primer login de un
agente crea su perfil automáticamente — no hace falta alta manual.

## Pendiente antes de poder entrar de verdad: crear el cliente OAuth de Google

Esto solo lo puede hacer alguien con acceso al Google Workspace de
`inmobiliariapalanca.com` (no yo, no tengo acceso a esa consola):

1. Entra en [Google Cloud Console](https://console.cloud.google.com/) con una
   cuenta @inmobiliariapalanca.com (o crea un proyecto de Google Cloud nuevo
   si la agencia no tiene uno todavía — es gratuito para esto).
2. **APIs y servicios → Pantalla de consentimiento OAuth**: tipo "Interno"
   (así solo lo pueden usar cuentas del propio Workspace — Google ni
   siquiera deja que gente de fuera intente entrar). Rellena el nombre de
   la app ("Plan de Marketing RK") y guarda.
3. **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo de aplicación: **Aplicación web**.
   - Orígenes de JavaScript autorizados: añade la URL de producción cuando
     la tengas (p. ej. `https://plan-marketing-agente.vercel.app`) y, para
     probar en local, `http://localhost:3111` (o el puerto que uses con
     `vercel dev`).
   - No hace falta "URI de redirección" (el flujo que usa esta app,
     Google Identity Services, no redirige).
4. Copia el **Client ID** que te da (termina en `.apps.googleusercontent.com`).
5. Pásamelo (o ponlo tú mismo) en `.env.local` y en las variables de entorno
   del proyecto de Vercel — ver más abajo.

Con "Interno" en el paso 2, Google ya bloquea cualquier cuenta que no sea
`@inmobiliariapalanca.com` antes de que la app la vea; el backend
(`api/auth/google.js`) además vuelve a comprobarlo por su cuenta.

## Variables de entorno

En `.env.local` (local) y en Vercel → Settings → Environment Variables
(development, preview y production):

| Variable | Ya configurada | Qué es |
|---|---|---|
| `DATABASE_URL` | ✅ | Conexión a Neon |
| `SESSION_SECRET` | ✅ (autogenerada) | Firma la cookie de sesión |
| `GOOGLE_CLIENT_ID` | ⏳ pendiente | Client ID de Google (backend) |
| `VITE_GOOGLE_CLIENT_ID` | ⏳ pendiente | Mismo Client ID, expuesto al frontend (no es secreto) |

Cuando tengas el Client ID, para añadirlo a Vercel:

```bash
npx vercel env add GOOGLE_CLIENT_ID production
npx vercel env add GOOGLE_CLIENT_ID preview
npx vercel env add GOOGLE_CLIENT_ID development
npx vercel env add VITE_GOOGLE_CLIENT_ID production
npx vercel env add VITE_GOOGLE_CLIENT_ID preview
npx vercel env add VITE_GOOGLE_CLIENT_ID development
```

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

Sin `GOOGLE_CLIENT_ID`/`VITE_GOOGLE_CLIENT_ID` configurados, `vercel dev`
funciona igual pero se queda en la pantalla de login (con un aviso de que
falta configurarlo) porque no puede verificar ningún login real.

## Estructura

```
├── db/schema.sql               # Esquema relacional completo (Postgres), aplicado ya en Neon
├── api/
│   ├── _db.js                   # Cliente Neon + protegido() (exige sesión, aísla datos por agente)
│   ├── _auth.js                  # Cookie de sesión firmada (JWT, biblioteca "jose")
│   ├── auth/
│   │   ├── google.js              # POST: verifica el login de Google y crea/actualiza el perfil
│   │   ├── me.js                  # GET: perfil del agente autenticado (401 si no hay sesión)
│   │   └── logout.js              # POST: borra la cookie de sesión
│   ├── contactos.js              # GET lista · POST alta · PATCH marcar contactado hoy · PUT editar
│   ├── catalogo.js               # GET catálogo de acciones M2/M3 (global, no por agente)
│   ├── plan.js                   # GET plan activo · POST añadir acción · DELETE quitar acción
│   ├── tareas.js                 # GET lista · PATCH completar/descompletar (+ puntos)
│   ├── puntos.js                 # GET puntos del mes + objetivo
│   ├── automatizaciones.js       # GET automatizaciones con su plantilla de tareas
│   ├── eventos-hito.js           # POST registra un hito y genera las tareas (Plan 30-60)
│   └── recursos.js               # GET repositorio de herramientas (global)
├── src/
│   ├── App.jsx                    # Shell: pantalla de login / demo / app, según el estado de sesión
│   ├── api/client.js              # Cliente fetch + comprobarSesion() (distingue demo/sin-sesión/autenticado)
│   ├── components/Login.jsx        # Botón "Iniciar sesión con Google" (Google Identity Services)
│   ├── index.css                   # Estilos, identidad RK (Montserrat, naranja #cf731b)
│   ├── data/mockData.js            # Datos de ejemplo (mismo formato que las tablas de db/schema.sql)
│   ├── utils/semaforo.js           # Lógica compartida de cadencia (días sin contacto → verde/ámbar/rojo)
│   └── components/
│       ├── HabitTrackerDashboard.jsx   # Puntos Inolvidable + semáforo + tareas del día
│       ├── PlanConfigurator.jsx        # Configurador trimestral: elige 2-4 acciones del catálogo
│       ├── ContactsCRM.jsx             # CRM: semáforo, filtros, alta/edición de contacto y "marcar contactado hoy"
│       ├── AutomationManager.jsx       # Gestor de acciones condicionadas (Plan 30-60)
│       └── ResourceRepository.jsx      # Repositorio de herramientas (guías, plantillas, certificados)
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
   todo por ese `agente_id`: un agente nunca ve los datos de otro.

## Cosas a tener en cuenta

- **Vercel ya está enlazado.** Al probar el backend con `vercel dev` se creó
  y enlazó el proyecto `plan-marketing-agente` en tu cuenta de Vercel
  (`almudena-s-projects2`), conectado al repo de GitHub
  `agalvez-tech/BASE-Rk-Palanca-Fontestad`. No he hecho ningún deploy ni
  push — el proyecto está listo pero nada se ha publicado todavía.
- **Base de datos Neon:** proyecto `plan-marketing-agente`
  (`tiny-violet-17698328`), región `eu-central-1`, completamente aislado del
  Neon de producción `palanca` (que es el ERP real de la agencia, gestionado
  con Prisma — no se tocó).
- **Los datos de ejemplo pertenecen a un "agente demo"** (`demo@rkpalanca.com`)
  que nunca podrá loguearse de verdad (no es del dominio real). Las
  automatizaciones "Tras firma de venta" y "Tras captación firmada" sí son
  plantillas globales de oficina (`agente_id = NULL`), así que todo agente
  nuevo las ve desde el primer día; sus contactos, plan y puntos, en cambio,
  empiezan vacíos hasta que él mismo los rellene.
- **`.env.local` está en `.gitignore`.** Nunca se commitea ningún secreto;
  `.env.example` solo tiene placeholders.

## Siguiente paso lógico

- Crear el Client ID de Google (ver arriba) y probar un login real.
- Cuando quieras publicarlo de verdad: revisa el proyecto de Vercel
  (nombre, dominio) y haz `git push` para que despliegue.
