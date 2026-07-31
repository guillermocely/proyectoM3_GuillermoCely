🎨 Mockup en Figma: https://www.figma.com/design/4cMFyX2mDDbK252wZbL0JX/Untitled?node-id=0-1&t=D0GZXpg6BWOTiqq4-1

# Aiflowix

Aiflowix es una aplicación web de chat interactivo que permite conversar con personajes ficticios icónicos mediante inteligencia artificial generativa. Es una Single Page Application (SPA) construida completamente en frontend que combina una arquitectura moderna con un diseño premium y responsivo.

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos modernos con sistema de temas dark/light
- **JavaScript (ES6 Modules)**: Lógica de la aplicación con módulos ES6
- **Vitest**: Framework de testing para JavaScript
- **@google/generative-ai**: SDK de Google para integración con Gemini AI
- **axios**: Cliente HTTP para peticiones API (opcional)

## Estructura del Proyecto

```
Aiflowix/
├── api/                      # Endpoints serverless para Vercel
│   └── chat.js              # API de chat con Gemini AI
├── css/                     # Estilos organizados por componentes
│   ├── base/               # Reset y estilos base
│   ├── barra-navegacion/   # Navegación principal
│   ├── cuerpo/             # Layout principal
│   ├── chat/               # Estilos del chat
│   ├── personajes/         # Estilos de cards de personajes
│   ├── temas/              # Sistema dark/light
│   ├── responsive/         # Media queries (mobile, tablet, desktop)
│   ├── main.css           # Punto de entrada de CSS
│   └── styles.css          # Estilos adicionales
├── docs/                    # Documentación y assets
│   └── imagenes/           # Avatares de personajes
├── src/                     # Lógica JavaScript modular
│   ├── characters/         # Definiciones de personajes
│   │   ├── iron-man.js     # Configuración Iron Man
│   │   ├── homer-simpson.js # Configuración Homer Simpson
│   │   ├── sub-zero.js     # Configuración Sub-Zero
│   │   └── responder.js    # Motor de respuestas locales
│   ├── router/             # Sistema de routing SPA
│   │   ├── router.js       # Enrutador principal
│   │   └── navigation.js   # Intercepción de links
│   ├── views/              # Componentes de vista
│   │   ├── home.js         # Vista de inicio
│   │   ├── characters.js   # Vista de selección de personajes
│   │   ├── chat.js         # Vista de chat
│   │   ├── about.js        # Vista about
│   │   └── notfound.js     # Vista 404
│   ├── chatLogic.js        # Lógica de comunicación con API
│   ├── main.js             # Punto de entrada de la aplicación
│   ├── theme.js            # Sistema de temas dark/light
│   └── utils.js            # Utilidades (formatTime, buildMessages, etc.)
├── tests/                   # Suite de tests con Vitest
│   └── utils.test.js       # Tests de utilidades
├── .env                     # Variables de entorno (no versionado)
├── .gitignore              # Archivos ignorados por Git
├── index.html              # Punto de entrada HTML
├── package.json            # Dependencias y scripts
├── vitest.config.js        # Configuración de Vitest
└── README.md               # Documentación del proyecto
```

### Descripción de Módulos Principales

- **`src/main.js`**: Punto de entrada que inicializa el tema, configura el router y maneja eventos de navegación
- **`src/router/`**: Sistema de routing personalizado usando History API para navegación SPA sin recargas
- **`src/views/`**: Componentes que renderizan cada vista de la aplicación (home, characters, chat, about)
- **`src/chatLogic.js`**: Lógica de comunicación con la API de Gemini, incluyendo seguimiento de tokens por sesión
- **`src/theme.js`**: Sistema de temas dark/light con persistencia en localStorage
- **`src/utils.js`**: Funciones utilitarias para formateo de tiempo, construcción de mensajes y parsing de respuestas
- **`src/characters/`**: Definiciones de personajes con sus personalidades, system instructions y respuestas locales
- **`api/chat.js`**: Endpoint serverless que conecta con Gemini AI usando el SDK de Google

## Instalación

### Requisitos Previos

- Node.js (v16 o superior)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Git (para clonar el repositorio)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/guillermocely/proyectoM3_GuillermoCely.git
   cd proyectoM3_GuillermoCely
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto con la siguiente variable:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   ```
   
   Para obtener una API key de Gemini:
   - Visita [Google AI Studio](https://aistudio.google.com/)
   - Crea un proyecto y genera una API key
   - Copia la key y pégala en tu archivo `.env`

   **Nota**: El archivo `.env` está incluido en `.gitignore` por seguridad. No commits de datos reales.

## Ejecución

### Desarrollo Local

Para levantar el servidor de desarrollo:

```bash
npm run dev:local
```

O alternativamente:

```bash
npm start
```

Esto iniciará un servidor local en el puerto 3000. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Live Server (Opcional)

Si usas VS Code, también puedes usar la extensión "Live Server" para servir el archivo `index.html` directamente.

## Testing

El proyecto utiliza Vitest para testing de utilidades y lógica de negocio.

### Ejecutar Tests

```bash
npm test
```

Esto ejecutará la suite de tests definida en `tests/utils.test.js`, que actualmente prueba:
- `buildMessages()`: Construcción de mensajes con system prompt
- `parseApiResponse()`: Parsing de respuestas de la API

### Configuración de Tests

La configuración de Vitest se encuentra en `vitest.config.js`:
- Environment: Node
- Globals: habilitados para usar `describe`, `it`, `expect` globalmente

## Conexión con la API

El frontend se conecta con el backend a través del endpoint `/api/chat` ubicado en la carpeta `api/`.

### Endpoint: `/api/chat`

- **Método**: POST
- **Body**:
  ```json
  {
    "messages": [
      { "role": "system", "content": "instrucción del sistema" },
      { "role": "user", "content": "mensaje del usuario" }
    ],
    "characterId": "iron-man",
    "systemInstruction": "instrucción específica del personaje"
  }
  ```
- **Response**:
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

### Integración con Gemini AI

La API utiliza el SDK `@google/generative-ai` para conectarse con el modelo `gemini-3.5-flash-lite` de Google. Incluye:

- **Seguimiento de tokens**: Control de tokens acumulados por sesión (límite: 250,000/min)
- **Respaldo local**: Si la API falla, usa respuestas locales definidas en `src/characters/responder.js`
- **Logging**: Registro de consumo de tokens en consola para monitoreo

## Router y Vistas

Aiflowix implementa un sistema de routing personalizado usando la History API del navegador para una experiencia SPA fluida.

### Sistema de Routing

- **Router**: `src/router/router.js` - Mapea rutas a vistas
- **Navigation**: `src/router/navigation.js` - Intercepta clicks en links para navegación sin recargas

### Rutas Disponibles

- `/` - Home (vista de bienvenida)
- `/characters` - Selección de personajes
- `/chat?character=id` - Chat con personaje específico
- `/about` - Información del proyecto
- `*` - 404 (página no encontrada)

### Vistas

- **`home.js`**: Vista de inicio con CTA para explorar personajes
- **`characters.js`**: Grid de cards de personajes con efecto flip
- **`chat.js`**: Interfaz de chat con historial, indicadores de typing, y menú de opciones
- **`about.js`**: Información del proyecto y características
- **`notfound.js`**: Página 404 para rutas inexistentes

## Despliegue

### Vercel

El proyecto está configurado para despliegue en Vercel. La carpeta `.vercel/` contiene configuración específica de la plataforma.

#### Pasos para Desplegar en Vercel

1. **Instalar Vercel CLI** (si no está instalado)
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel**
   ```bash
   vercel login
   ```

3. **Desplegar**
   ```bash
   vercel
   ```

4. **Configurar variables de entorno**
   - En el dashboard de Vercel, agrega `GEMINI_API_KEY` como variable de entorno
   - Usa el valor de tu API key de Gemini

#### Configuración de Build

Vercel detecta automáticamente que es un proyecto estático y sirve los archivos HTML, CSS y JavaScript. Los endpoints en `api/` se tratan como funciones serverless.

### Variables de Entorno en Producción

Asegúrate de configurar las siguientes variables en tu plataforma de despliegue:
- `GEMINI_API_KEY`: Tu API key de Google Gemini

## Capturas de Pantalla

*Sección reservada para capturas de pantalla del proyecto*

[Home](docs/screenshots/home.png)
[Personajes](docs/screenshots/characters.png)
[Chat](docs/screenshots/chat.png)
[About](docs/screenshots/about.png)

## Características Principales

- **SPA Responsiva**: Navegación fluida sin recargas de página
- **Sistema de Temas**: Toggle entre modo dark y light con persistencia
- **Chat Inteligente**: Integración con Gemini AI para respuestas contextuales
- **Personajes Únicos**: Tres personajes con personalidades distintivas (Iron Man, Homer Simpson, Sub-Zero)
- **Respaldo Local**: Funciona incluso sin conexión a la API usando respuestas predefinidas
- **Historial de Chat**: Persistencia de conversacionesen localStorage
- **Indicadores de Estado**: Muestra "Escribiendo..." cuando el personaje responde
- **Control de Tokens**: Monitoreo de consumo de tokens de Gemini por sesión
- **Testing**: Suite de tests con Vitest para asegurar calidad del código

## Licencia

Este proyecto es privado y de uso educativo.

## Autor

Guillermo Cely - Proyecto M3
