export function renderNotFound() {
  const app = document.getElementById('app');
  document.body.classList.remove('chat-route');
  document.body.classList.remove('home-route');
  
  app.innerHTML = `
    <section>
      <h2>404 - Esta ruta no existe en ChatFlow</h2>
      <p>Revisá la URL, o volvé al <a href="/">inicio</a>.</p>
    </section>
  `;
}