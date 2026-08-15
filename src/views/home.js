import { navigateTo } from '../router/navigation.js';

export function renderHome() {
  const app = document.getElementById('app');
  document.body.classList.remove('chat-route');
  document.body.classList.add('home-route');

  app.innerHTML = `
    <section class="home-section">
      <h2 class="home-title">Bienvenido a Aiflowix</h2>
      <p class="home-description">Conversa con personajes icónicos usando IA generativa y una SPA responsive preparada para mostrar en una prueba de concepto.</p>
      <div class="home-actions">
        <a href="/characters" class="home-cta-btn">Explorar personajes</a>
        <a href="/about" class="home-cta-btn home-cta-btn--secondary">Conocer el proyecto</a>
      </div>
    </section>
  `;

  app.querySelector('a[href="/characters"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    navigateTo('/characters');
  });

  app.querySelector('a[href="/about"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    navigateTo('/about');
  });
}