# Aiflowix 🤖

Chat interactivo con personajes ficticios (Loki, Homer Simpson, Sub-Zero) — SPA responsive con respuestas generadas por Gemini.

🎨 [Mockup en Figma](https://www.figma.com/design/4cMFyX2mDDbK252wZbL0JX/Untitled?node-id=0-1&t=D0GZXpg6BWOTiqq4-1) · 🚀 [Demo en Vercel](https://proyecto-m3-guillermo-cely.vercel.app/)

## ⚡ Inicio rápido

> Requisito: **Node.js 22 LTS** ([nodejs.org](https://nodejs.org)) · verifica con `node -v`

```bash
git clone https://github.com/guillermocely/proyectoM3_GuillermoCely.git
cd proyectoM3_GuillermoCely/Aiflowix
npm install
copy .env.example .env        # ← y coloca tu GEMINI_API_KEY dentro
vercel dev                    # → http://localhost:3000
```

Sin API key la vista carga igual con `npm run dev:local` (solo diseño), pero el chat necesita la API para responder.

🧪 Tests: `npm test` → **17 tests · 3 archivos · todos pasando**

<details>
<summary>🛠️ Instalación detallada (paso a paso)</summary>

**1. Instalar Node.js 22 LTS** — versión estable con la que se desarrolló y probó el proyecto. Descárgalo de [nodejs.org](https://nodejs.org) y verifica:

```bash
node -v   # v22.x.x
npm -v
```

**2. Clonar el repositorio**

```bash
git clone https://github.com/guillermocely/proyectoM3_GuillermoCely.git
cd proyectoM3_GuillermoCely/Aiflowix
```

**3. Instalar dependencias**

```bash
npm install
```

Instala todo lo necesario, incluidas **Vite y Vitest** (motor de pruebas) y el SDK `@google/generative-ai`. No hay que instalar nada más.

**4. Configurar la API key (.env)**

El archivo `.env` **no viene en el repositorio** (está en `.gitignore` por seguridad). Créalo desde la plantilla:

```bash
copy .env.example .env      # Windows
# cp .env.example .env      # Linux / macOS
```

Edítalo con tu clave (gratis en [aistudio.google.com/apikey](https://aistudio.google.com/apikey)):

```env
GEMINI_API_KEY=tu_api_key_de_gemini
```

> ⚠️ La clave debe ir **sin espacios ni puntos extra** — una clave que termina en `.` devuelve error 401 (`ACCESS_TOKEN_TYPE_UNSUPPORTED`).

</details>

<details>
<summary>▶️ Ejecución local</summary>

**Opción recomendada — con API real (Vercel CLI):**

`/api/chat` es una función **serverless**, así que un servidor estático no basta para probar el chat con Gemini:

```bash
npm install -g vercel    # una sola vez
vercel dev               # sirve los estáticos Y ejecuta /api/chat
```

→ http://localhost:3000

**Opción estática (sin API):**

```bash
npm run dev:local        # o npm start (usa npx serve, puerto 3000)
```

⚠️ `serve` no ejecuta `/api/chat`: el chat mostrará un error de conexión. Útil solo para revisar diseño y navegación.

</details>

<details>
<summary>🧪 Testing</summary>

Suite con **Vitest** (incluido en devDependencies; se instala con `npm install`):

```bash
npm test
```

**17 tests en 3 archivos** — validan `buildMessages()`, `parseApiResponse()`, `formatTime()`, `escapeHtml()`, `getReply()` (motor de respuestas locales de prueba) y el manejo de errores + envío del historial en `sendChatMessage()`.

**Scripts manuales:**
- `test-api.js` — verifica el formato del body enviado a `/api/chat` (solo `messages`, `characterId`, `systemInstruction`)
- `test-gemini.mjs` — chat interactivo en terminal con Gemini: `node test-gemini.mjs`

</details>

<details>
<summary>📁 Estructura del proyecto</summary>

```text
Aiflowix/
├── api/
│   └── chat.js                  # API serverless para Gemini
├── css/
│   ├── base/reset.css
│   ├── barra-navegacion/barra-navegacion.css
│   ├── chat/chat.css
│   ├── cuerpo/cuerpo.css
│   ├── personajes/personajes.css   # tarjetas + efecto 3D pop
│   ├── responsive/                 # desktop / mobile / tablet
│   ├── temas/temas.css
│   ├── main.css
│   └── styles.css
├── docs/imagenes/               # homero.png, loki.png, sub-zero.png
├── src/
│   ├── characters/              # loki, homer-simpson, sub-zero + responder.js (respuestas locales de prueba)
│   ├── router/                  # router.js + navigation.js (History API)
│   ├── views/                   # home, characters, chat, about, notfound
│   ├── chatLogic.js             # envío a /api/chat + manejo de errores
│   ├── main.js                  # punto de entrada
│   ├── theme.js                 # tema oscuro/claro
│   └── utils.js
├── tests/                       # chatLogic, responder, utils (17 tests)
├── .env.example                 # plantilla de variables de entorno
├── index.html
├── jquery.ripples.min.js        # efecto ripple (v0.5.3, local)
├── vercel.json                  # SPA fallback para Vercel
└── vitest.config.js
```

`node_modules/` y `.env` no están versionados: se generan con `npm install` y el paso 4 de la instalación.

**Módulos clave:**
- `src/chatLogic.js` — envía el historial a `/api/chat`; si la API falla, informa el error en el chat
- `api/chat.js` — endpoint serverless con el SDK `@google/generative-ai`
- `src/characters/` — personalidad (`systemInstruction`) y sugerencias por personaje

</details>

<details>
<summary>🔌 API: <code>/api/chat</code></summary>

- **Método**: `POST`
- **Body**:

```json
{
  "messages": [{ "role": "user", "content": "mensaje" }],
  "characterId": "loki",
  "systemInstruction": "instrucción del personaje"
}
```

- **Respuesta**:

```json
{
  "reply": "respuesta de la IA",
  "usage": { "promptTokens": 100, "outputTokens": 50, "totalTokens": 150 }
}
```

El handler envía a Gemini el historial completo (`user`/`model`) para mantener contexto; la personalidad viaja aparte en `systemInstruction`. Si la llamada falla, el chat muestra un mensaje de error: el personaje solo responde con la API.

</details>

<details>
<summary>🤖 Integración con Gemini</summary>

- Librería: `@google/generative-ai` (integración directa — no usa OpenRouter ni el SDK de `openai`)
- Modelo: `gemini-3.5-flash-lite`
- Variable de entorno: `GEMINI_API_KEY`
- Config: `maxOutputTokens: 64`, `temperature: 0.6` (respuestas breves, aptas para el free tier)

</details>

<details>
<summary>🗺️ Rutas y vistas</summary>

| Ruta | Vista |
|---|---|
| `/` | Home (`home.js`) |
| `/characters` | Selección de personajes (`characters.js`) |
| `/chat?character=loki` | Chat (`chat.js`) |
| `/about` | Acerca del proyecto (`about.js`) |
| `*` | 404 (`notfound.js`) |

Routing SPA con History API: `src/router/router.js` mapea rutas y `navigation.js` intercepta los clicks sin recargar la página.

</details>

<details>
<summary>✨ Características y detalles técnicos</summary>

- **SPA responsiva** (mobile, tablet, desktop) con navegación sin recargas
- **Efecto 3D en tarjetas**: la tarjeta queda fija y el personaje "sale" del marco al hacer hover, con pedestal de color por personaje (CSS puro, con soporte `prefers-reduced-motion`)
- **Temas dark/light** con persistencia
- **Manejo de errores**: si la API falla (sin conexión, cuota agotada, key inválida), el chat informa el problema en la conversación
- **Historial persistente** por personaje + indicadores "En línea" / "Escribiendo..."
- **Efecto ripple** de agua con jQuery (`jquery.ripples.min.js` local) — solo desktop (`min-width: 768px` y `pointer: fine`)

</details>

<details>
<summary>☁️ Despliegue en Vercel</summary>

**Opción A — Dashboard:** subir el repo a GitHub → [vercel.com](https://vercel.com) → Add New Project → Import → en **Environment Variables** agregar `GEMINI_API_KEY` → Deploy.

**Opción B — CLI:**

```bash
npm install -g vercel
vercel login
vercel link
vercel env add GEMINI_API_KEY production
vercel            # preview
vercel --prod     # producción
```

`vercel.json` agrega el SPA fallback: las rutas sin extensión se sirven con `index.html`; `/api/*` y archivos con extensión quedan excluidos del rewrite.

</details>

## Licencia

Proyecto privado y de uso educativo.

## 👨‍💻 Desarrollador

**Guillermo Efren Cely** — Proyecto M3
