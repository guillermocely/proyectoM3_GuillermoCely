import { router } from "./router/router.js";
import { setupLinkInterception } from "./router/navigation.js";
import { initTheme } from "./theme.js";

// 0. Inicializar tema (modo oscuro/claro)
initTheme();

// 1. Intercepción de links internos
setupLinkInterception();
setupMobileMenu();

// 2. Manejo de Back/Forward
window.addEventListener('popstate', router);

// 3. Render inicial basado en la URL actual
router();

function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (!menu.contains(target) && !toggle.contains(target)) {
      closeMenu();
    }
  });
}
