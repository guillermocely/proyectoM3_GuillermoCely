🎨 Mockup en Figma: https://www.figma.com/design/4cMFyX2mDDbK252wZbL0JX/Untitled?node-id=0-1&t=D0GZXpg6BWOTiqq4-1

🚀 Demo en Vercel: https://proyecto-m3-guillermo-cely.vercel.app/

# Aiflowix

Aiflowix es una aplicación web de chat interactivo con personajes ficticios y una SPA responsive. El proyecto combina navegación cliente-side, estilos visuales personalizados y una API para generar respuestas con modelos externos.

## Tecnologías Utilizadas

- **HTML5**: estructura semántica de la aplicación.
- **CSS3**: estilos visuales y layout responsivo.
- **JavaScript (ES6 Modules)**: lógica de la SPA, vistas y chat.
- **Vitest**: framework de pruebas para utilidades y validaciones.
- **Google Generative AI SDK**: se usa en `api/chat.js` para conectarse directamente a la API de Gemini.
- **jQuery + jquery.ripples**: efecto visual de agua/ripple cargado desde CDN en `index.html`.

Nota: el proyecto no usa OpenRouter ni el SDK de `openai`. La integración es directa con Gemini a través de `@google/generative-ai`, usando el modelo `gemini-3.5-flash-lite`.

## Estructura del Proyecto

```text
Aiflowix/
├── api/
│   └── chat.js                  # API serverless para Gemini
├── css/
│   ├── base/
│   │   └── reset.css
│   ├── barra-navegacion/
│   │   └── barra-navegacion.css
│   ├── chat/
│   │   └── chat.css
│   ├── cuerpo/
│   │   └── cuerpo.css
│   ├── personajes/
│   │   └── personajes.css
│   ├── responsive/
│   │   ├── desktop.css
│   │   ├── mobile.css
│   │   └── tablet.css
│   ├── temas/
│   │   └── temas.css
│   ├── main.css
│   └── styles.css
├── docs/
│   └── imagenes/
│       ├── homer.png
│       ├── loki.png
│       └── sub-zero.png
├── src/
│   ├── characters/
│   │   ├── homer-simpson.js
│   │   ├── loki.js
│   │   ├── responder.js
│   │   └── sub-zero.js
│   ├── router/
│   │   ├── navigation.js
│   │   └── router.js
│   ├── views/
│   │   ├── about.js
│   │   ├── characters.js
│   │   ├── chat.js
│   │   ├── home.js
│   │   └── notfound.js
│   ├── chatLogic.js
│   ├── main.js
│   ├── theme.js
│   └── utils.js
├── tests/
│   ├── chatLogic.test.js
│   ├── responder.test.js
│   └── utils.test.js
├── .env                        # local, no versionado
├── .env.example                # plantilla de variables de entorno
├── .gitignore
├── index.html
├── jquery.ripples.min.js       # librería local del efecto ripple
├── package.json
├── test-api.js                 # script manual de verificación del body enviado a /api/chat
├── test-gemini.mjs             # chat interactivo de prueba con Gemini (elegís el personaje)
├── vitest.config.js
├── README.md
└── node_modules/              # generado por npm install
```

Nota: la carpeta `.vercel/` no forma parte del repositorio clonado; se genera automáticamente al desplegar el proyecto en Vercel y está incluida en `.gitignore`.

### Descripción de Módulos Principales

- **`src/main.js`**: punto de entrada que inicializa la app, el router y el tema.
- **`src/router/`**: sistema de navegación SPA con History API.
- **`src/views/`**: vistas de home, personajes, chat, about y 404.
- **`src/chatLogic.js`**: se encarga de enviar el historial al endpoint `/api/chat` y manejar el fallback.
- **`src/theme.js`**: lógica del tema oscuro/claro.
- **`src/utils.js`**: utilidades de formato y construcción de mensajes.
- **`src/characters/`**: definiciones del personaje con `systemInstruction`, sugerencias y fallback local.
- **`api/chat.js`**: endpoint serverless que se conecta a Gemini usando el SDK `@google/generative-ai`.

## Instalación

### Requisitos Previos

- Node.js 16 o superior
- Navegador moderno
- Git
- Vercel CLI (recomendado): `npm install -g vercel`

### 1) Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd Aiflowix
```

### 2) Instalar dependencias

```bash
npm install
```

### 3) Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
GEMINI_API_KEY=tu_api_key_de_gemini
```

Importante: la clave real usada por el código es `GEMINI_API_KEY`, no `OPENROUTER_API_KEY`.

El proyecto usa el SDK `@google/generative-ai` con el modelo `gemini-3.5-flash-lite` dentro de `api/chat.js`.

## Ejecución Local

### Opción recomendada: con la API funcionando (Vercel CLI)

La ruta `/api/chat` es una **función serverless**, por eso no alcanza con un servidor de archivos estáticos. Para probar el chat con respuestas reales de Gemini:

#### 1) Instalar Vercel CLI (una sola vez)

```bash
npm install -g vercel
```

> Vercel CLI es un paquete **global**: no viene dentro de `package.json`, así que al clonar el repositorio hay que reinstalarlo.

#### 2) Configurar la clave de Gemini

El archivo `.env` **no está versionado** (está en `.gitignore`), así que después de clonar hay que crearlo. Copialo desde la plantilla:

```bash
copy .env.example .env
```

Y completalo con tu clave:

```env
GEMINI_API_KEY=tu_api_key_de_gemini
```

#### 3) Iniciar el servidor local

```bash
vercel dev
```

Se accede en:

```text
http://localhost:3000
```

`vercel dev` sirve los archivos estáticos **y** ejecuta la función `/api/chat`.

### Opción estática (sin API)

```bash
npm run dev:local   # o npm start
```

Esto levanta el sitio con `npx serve` en el puerto 3000.

⚠️ **Ojo**: `serve` solo sirve archivos estáticos. El chat NO va a responder porque la ruta `/api/chat` no se ejecuta. Usá esta opción solo para ver el diseño sin la API.

## Testing

El proyecto usa Vitest como suite de pruebas.

### Ejecutar tests

```bash
npm test
```

La suite actual está en `tests/` (17 tests en 3 archivos) y valida `buildMessages()`, `parseApiResponse()`, `formatTime()`, `escapeHtml()` (utils), `getReply()` (responder) y el envío del historial en `sendChatMessage()`.

### Script manual de prueba

El archivo raíz `test-api.js` es un script manual para verificar el formato del body que se envía a `/api/chat`.

Diferencia con Vitest:
- `tests/utils.test.js` corre pruebas automatizadas de utilidades.
- `test-api.js` es una comprobación manual del payload que el cliente envía a la API, y sirve para validar que el body contiene solo `messages`, `characterId` y `systemInstruction`.

Además, `test-gemini.mjs` es un **chat interactivo en la terminal** con Gemini: elegís el personaje (Loki, Homer o Sub-Zero) y conversás directamente con el modelo. Usa un límite de 50 tokens y temperatura 0.6 para no gastar en la versión de prueba:

```bash
node test-gemini.mjs
```

## Conexión con la API

El frontend llama al endpoint `/api/chat` desde `src/chatLogic.js`.

### Endpoint: `/api/chat`

- **Método**: `POST`
- **Body**:

```json
{
  "messages": [
    { "role": "system", "content": "instrucción del sistema" },
    { "role": "user", "content": "mensaje del usuario" }
  ],
  "characterId": "loki",
  "systemInstruction": "instrucción específica del personaje"
}
```

- **Respuesta esperada**:

```json
{
  "reply": "respuesta de la IA",
  "usage": {
    "promptTokens": 100,
    "outputTokens": 50,
    "totalTokens": 150
  }
}
```

## Integración con Gemini

La API real del proyecto usa Gemini de forma directa con el SDK `@google/generative-ai`.

Lo que existe en código es lo siguiente:

- archivo: `api/chat.js`
- librería: `@google/generative-ai`
- proveedor: Google AI (Gemini API)
- modelo: `gemini-3.5-flash-lite`
- variable de entorno: `GEMINI_API_KEY`

El handler crea una instancia de `GoogleGenerativeAI` y envía el historial completo de la conversación (turnos `user`/`model`) para que el modelo mantenga el contexto entre mensajes. El prompt de personalidad de cada personaje viaja por separado en `systemInstruction`.

Si la llamada falla, el proyecto cae a un respaldo local definido en `src/characters/responder.js` y usa palabras clave/fallback del personaje.

## Router y Vistas

Aiflowix implementa un sistema de routing personalizado con History API para una SPA sin recargas.

### Sistema de Routing

- **`src/router/router.js`**: mapea rutas a vistas.
- **`src/router/navigation.js`**: intercepta clicks para navegar sin recargar la página.

### Rutas Disponibles

- `/` - Home
- `/characters` - selección de personajes
- `/chat?character=loki` - chat con personaje específico
- `/about` - información del proyecto
- `*` - 404

### Vistas

- **`home.js`**: vista inicial y CTA.
- **`characters.js`**: grid de personajes con efecto flip.
- **`chat.js`**: interfaz de chat, historial, estado de escritura y menú.
- **`about.js`**: información del proyecto.
- **`notfound.js`**: vista para rutas inexistentes.

## Efecto Visual de Agua (Ripple)

La interfaz incluye un efecto visual de agua/ripple implementado con jQuery y la librería `jquery.ripples` cargada en `index.html`:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js"></script>
```

La configuración actual aplica el efecto al `body` con resolución y perturbación predefinidas.

## Despliegue

### Vercel

El proyecto está pensado para desplegarse en Vercel. La carpeta `.vercel/` es un artefacto generado por la plataforma y no forma parte del repositorio clonado (está en `.gitignore`). Vercel detecta automáticamente la carpeta `api/` como funciones serverless.

#### Opción A: Desde el dashboard (recomendada)

1. Subir el repositorio a GitHub (`git push`).
2. Entrar en [vercel.com](https://vercel.com) → **Add New Project** → **Import** el repositorio.
3. En **Environment Variables**, agregar:
   - `GEMINI_API_KEY` = tu clave de Gemini
4. Click en **Deploy**.

#### Opción B: Desde la terminal (Vercel CLI)

```bash
# 1) Instalar el CLI (una sola vez)
npm install -g vercel

# 2) Iniciar sesión (abre el navegador)
vercel login

# 3) Vincular la carpeta del proyecto (solo la primera vez)
vercel link

# 4) Agregar la variable de entorno en producción
vercel env add GEMINI_API_KEY production

# 5) Deploy a preview
vercel

# 6) Deploy a producción
vercel --prod
```

#### Verificar el deploy

- Abrir la URL del proyecto y probar el chat con un personaje.
- La ruta `/api/chat` debe responder:

```text
POST https://<tu-proyecto>.vercel.app/api/chat
```

#### Variables de entorno

- `GEMINI_API_KEY`: clave de acceso a la API de Google Gemini (se usa en `api/chat.js`).

Importante: la clave debe ir **sin espacios ni puntos extra**. Una clave que termina con un `.` devuelve error 401 (`ACCESS_TOKEN_TYPE_UNSUPPORTED`).

## Capturas de Pantalla

La sección de capturas no está completa en este repositorio. No existen archivos en `docs/screenshots/`, y el proyecto actual solo incluye imágenes en `docs/imagenes/` para los avatares del personaje.

Estado actual: **pendiente**.

## Características Principales

- **SPA responsiva**: navegación sin recargas completas.
- **Sistema de temas**: toggle visual dark/light con persistencia.
- **Chat con personajes**: cada personaje tiene personalidad y `systemInstruction`.
- **Integración con Gemini**: respuestas generadas por el modelo `gemini-3.5-flash-lite` con contexto completo de la conversación.
- **Fallback local**: si falla la API, la lógica usa reglas predefinidas del personaje.
- **Historial persistente**: almacenamiento local del historial por personaje.
- **Indicadores de estado**: "En línea" y "Escribiendo...".
- **Efecto ripple**: fondo con interacción de agua visual.
- **Testing**: suite con Vitest y script manual de validación del payload.

## Licencia

Este proyecto es privado y de uso educativo.

## Autor

Guillermo Cely - Proyecto M3
