export function renderAbout() {
  const app = document.getElementById('app');
  document.body.classList.remove('chat-route');

  app.innerHTML = `
    <section class="about-section">
      <h2 class="about-title">Acerca de Aiflowix</h2>
      <p class="about-description">Aiflowix es una experiencia de chat inmersiva desarrollada completamente en frontend. Nuestra plataforma conecta con personajes ficticios icónicos mediante inteligencia artificial, combinando tecnología de punta con un diseño moderno para crear conversaciones únicas y memorables.</p>
      
      <h3 class="characters-title">Personajes Disponibles</h3>
      <div class="characters-grid">
        <div class="character-card">
          <div class="character-icon">🍺</div>
          <h4>Homer Simpson</h4>
          <p>El padre de la familia Simpson</p>
        </div>
        <div class="character-card">
          <div class="character-icon">🦾</div>
          <h4>Iron Man</h4>
          <p>Tony Stark, genio y filántropo</p>
        </div>
        <div class="character-card">
          <div class="character-icon">❄️</div>
          <h4>Sub-Zero</h4>
          <p>Maestro del hielo Lin Kuei</p>
        </div>
      </div>

      <h3 class="features-title">Características</h3>
      <div class="about-features">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Arquitectura SPA</h3>
          <p>Navegación fluida sin recargas con URLs limpias y History API</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Diseño Premium</h3>
          <p>Interfaz moderna con temas dark/light y efectos visuales</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Chat Inteligente</h3>
          <p>Integración con Gemini para respuestas contextuales</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">�</div>
          <h3>Frontend Puro</h3>
          <p>Desarrollado completamente sin backend</p>
        </div>
      </div>
    </section>
  `;
}