import { loki } from '../characters/loki.js';
import { homerSimpson } from '../characters/homer-simpson.js';
import { subZero } from '../characters/sub-zero.js';
import { navigateTo } from '../router/navigation.js';

const characters = [loki, homerSimpson, subZero];

export function renderCharacters() {
  const app = document.getElementById('app');
  document.body.classList.remove('chat-route');
  document.body.classList.remove('home-route');

  app.innerHTML = `
    <div class="character-grid">
      ${characters.map((character) => `
        <article class="character-card" data-character="${character.id}" style="--char-color: ${character.themeColor}">
          <div class="character-card-inner">
            <div class="character-card-front">
              <div class="character-avatar">
                <img src="${character.avatar}" alt="${character.name}">
              </div>
              <h3 class="character-name">${character.name}</h3>
              <p class="character-real">${character.fullName}</p>
            </div>
            <div class="character-card-back">
              <h3 class="character-name">${character.name}</h3>
              <p class="character-description">${character.description}</p>
              <button class="chat-button" data-character="${character.id}">Chatear</button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  app.querySelectorAll('.chat-button').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const characterId = element.dataset.character;
      if (characterId) {
        navigateTo(`/chat?character=${characterId}`);
      }
    });
  });
}
