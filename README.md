# BASE · RK Palanca Fontestad 🚀

Hub interno de procesos de la oficina: trámites, formularios, conocimiento (NotebookLM), Gems de entrenamiento, GPTs legales y accesos directos a los CRM (HORUS e IA Gestión).

Construida con **React + Vite**, con la identidad corporativa RK Palanca Fontestad (Montserrat, naranja `#cf731b`, negro/blanco) y el concepto **"El Astronauta en el Casco Antiguo"**.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Subir a GitHub

```bash
git init
git add .
git commit -m "BASE RK Palanca Fontestad"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/base-rk-palanca.git
git push -u origin main
```

## Desplegar en Vercel

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Add New → Project** y selecciona el repositorio `base-rk-palanca`.
3. Vercel detecta Vite automáticamente — no hay que cambiar nada:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Pulsa **Deploy**. En un minuto tendrás la URL (p. ej. `base-rk-palanca.vercel.app`).

Cada `git push` a `main` redespliega automáticamente.

## Cómo se añaden procesos

Todos los procesos que ve el equipo están definidos en `src/data.js` (array `PROCESOS_BASE`). Para añadir uno nuevo para todo el equipo: edita ese archivo, añade la entrada y haz push — Vercel publicará el cambio automáticamente.

> Si en el futuro queréis que alguien pueda añadir un proceso desde la propia web sin tocar código, se puede conectar a Vercel KV o a un Cloudflare Worker (como el del informe de valoración) en una tarde.

## Estructura

```
├── index.html          # Entrada con la fuente Montserrat
├── vite.config.js
├── src/
│   ├── main.jsx        # Bootstrap de React
│   ├── App.jsx         # Toda la aplicación
│   ├── Astronauta.jsx  # El astronauta RK en SVG
│   ├── data.js         # ⭐ Procesos, categorías y CRMs (editar aquí)
│   └── index.css       # Estilos (identidad corporativa)
```

---

RK Palanca Fontestad · Desde 1976 · L'Horta Nord, Valencia
*No vendemos casas, gestionamos momentos vitales.*
