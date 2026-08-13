🎨 Mockup en Figma: https://www.figma.com/design/4cMFyX2mDDbK252wZbL0JX/Untitled?node-id=0-1&t=D0GZXpg6BWOTiqq4-1

🚀 Demo en Vercel: https://proyecto-m3-guillermo-cely.vercel.app/

# Aiflowix

Aiflowix es una aplicación web de chat interactivo con personajes ficticios y una SPA responsive. El proyecto combina navegación cliente-side, estilos visuales personalizados y una API para generar respuestas con modelos externos.

## Tecnologías Utilizadas

- **HTML5**: estructura semántica de la aplicación.
- **CSS3**: estilos visuales y layout responsivo.
- **JavaScript (ES6 Modules)**: lógica de la SPA, vistas y chat.
- **Vitest**: framework de pruebas para utilidades y validaciones.
- **OpenAI SDK**: se usa en `api/chat.js` para conectarse a OpenRouter.
- **jQuery + jquery.ripples**: efecto visual de agua/ripple cargado desde CDN en `index.html`.

Nota: en el código actual no se importan `@google/generative-ai`, `@openrouter/sdk` ni `axios` desde el proyecto. Esas dependencias aparecen en `package.json`, pero la implementación real en `api/chat.js` usa `openai` y OpenRouter.

## Estructura del Proyecto

```text
Aiflowix/
├── api/
│   └── chat.js                  # API serverless para OpenRouter
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
│   └── utils.test.js
├── .env                        # local, no versionado
├── .gitignore
├── index.html
├── package.json
├── test-api.js                 # script manual de verificación del body enviado a /api/chat
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
- **`api/chat.js`**: endpoint serverless que se conecta a OpenRouter usando el SDK `openai`.

## Instalación

### Requisitos Previos

- Node.js 16 o superior
- Navegador moderno
- Git

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
OPENROUTER_API_KEY=tu_api_key_aqui
```

Importante: la clave real usada por el código es `OPENROUTER_API_KEY`, no `GEMINI_API_KEY`.

El proyecto usa el SDK `openai` con baseURL `https://openrouter.ai` y el modelo `google/gemini-2.5-flash` dentro de `api/chat.js`.

## Ejecución Local

### Desarrollo local

```bash
npm run dev:local
```

o

```bash
npm start
```

Esto levanta el sitio en el puerto 3000 y se accede con:

```text
http://localhost:3000
```

## Testing

El proyecto usa Vitest como suite de pruebas.

### Ejecutar tests

```bash
npm test
```

La suite actual está en `tests/utils.test.js` y valida utilidades como `buildMessages()` y `parseApiResponse()`.

### Script manual de prueba

El archivo raíz `test-api.js` es un script manual para verificar el formato del body que se envía a `/api/chat`.

Diferencia con Vitest:
- `tests/utils.test.js` corre pruebas automatizadas de utilidades.
- `test-api.js` es una comprobación manual del payload que el cliente envía a la API, y sirve para validar que el body contiene solo `messages`, `characterId` y `systemInstruction`.

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

## Integración con OpenRouter

La API real del proyecto no usa Gemini directamente ni el SDK `@google/generative-ai`.

Lo que existe en código es lo siguiente:

- archivo: `api/chat.js`
- librería: `openai`
- proveedor: `https://openrouter.ai`
- modelo: `google/gemini-2.5-flash`
- variable de entorno: `OPENROUTER_API_KEY`

El handler crea una instancia de `OpenAI` con baseURL de OpenRouter y envía un mensaje con `systemInstruction` del personaje cuando corresponde.

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

El proyecto está pensado para desplegarse en Vercel. La carpeta `.vercel/` es un artefacto generado por la plataforma al desplegar y no es parte del repositorio clonado normalmente.

#### Pasos básicos

1. Conectar el repositorio a Vercel.
2. Configurar la variable de entorno `OPENROUTER_API_KEY` en el dashboard.
3. Hacer deploy del proyecto.
4. Confirmar que la ruta `/api/chat` está funcionando en el entorno desplegado.

#### Variables de entorno en producción

- `OPENROUTER_API_KEY`: clave de acceso a OpenRouter.

## Capturas de Pantalla

La sección de capturas no está completa en este repositorio. No existen archivos en `docs/screenshots/`, y el proyecto actual solo incluye imágenes en `docs/imagenes/` para los avatares del personaje.

Estado actual: **pendiente**.

## Características Principales

- **SPA responsiva**: navegación sin recargas completas.
- **Sistema de temas**: toggle visual dark/light con persistencia.
- **Chat con personajes**: cada personaje tiene personalidad y `systemInstruction`.
- **Integración con OpenRouter**: respuestas generadas por modelo externo.
- **Fallback local**: si falla la API, la lógica usa reglas predefinidas del personaje.
- **Historial persistente**: almacenamiento local del historial por personaje.
- **Indicadores de estado**: "En línea" y "Escribiendo...".
- **Efecto ripple**: fondo con interacción de agua visual.
- **Testing**: suite con Vitest y script manual de validación del payload.

## Licencia

Este proyecto es privado y de uso educativo.

## Autor

Guillermo Cely - Proyecto M3
