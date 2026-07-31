import { router } from "./router/router.js";
import { setupLinkInterception } from "./router/navigation.js";
import { initTheme } from "./theme.js";

// 0. Inicializar tema (modo oscuro/claro)
initTheme();

// 1. Intercepción de links internos
setupLinkInterception();

// 2. Manejo de Back/Forward
window.addEventListener('popstate', router);

// 3. Render inicial basado en la URL actual
router();
