import { router } from "./router.js";

export function navigateTo(path) {
  history.pushState(null, '', path);
  router();
}

export function setupLinkInterception() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Clicks modificados (Ctrl, Cmd, Shift, Alt)
    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (isModified) return;

    if (link.target === '_blank') return;                 // Target blank
    if (link.origin !== window.location.origin) return;   // Link externo

    if (href.startsWith('#')) return;                     // ancla
    if (href.startsWith('mailto:')) return;               // email
    if (href.startsWith('tel:')) return;                  // teléfono
    if (!href.startsWith('/')) return;                    // solo rutas internas

    event.preventDefault();
    navigateTo(href);
  });
}
