import { loki } from '../characters/loki.js';
import { homerSimpson } from '../characters/homer-simpson.js';
import { subZero } from '../characters/sub-zero.js';
import { sendChatMessage } from '../chatLogic.js';
import { escapeHtml, formatTime } from '../utils.js';

const characters = {
  'loki': loki,
  'homer-simpson': homerSimpson,
  'sub-zero': subZero
};

function getCharacterFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const characterId = params.get('character') || 'loki';
  return characters[characterId] || loki;
}

export function renderChat() {
  const app = document.getElementById('app');
  const character = getCharacterFromUrl();
  document.body.classList.add('chat-route');
  document.body.classList.remove('home-route');
  document.documentElement.style.setProperty('--char-color', character.themeColor);

  const storedHistory = JSON.parse(localStorage.getItem(`chatflow-${character.id}`) || 'null') || [];
  const history = storedHistory.length ? storedHistory : [
    {
      role: 'assistant',
      content: `¡Hola! Soy ${character.name}. ¿En qué puedo ayudarte hoy?`,
      time: formatTime(new Date())
    }
  ];

  app.innerHTML = `
    <div class="chat-shell">
      <div class="chat-header">
        <button class="chat-back" onclick="window.location.href='/characters'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <img src="${character.avatar}" alt="${character.name}" class="chat-avatar">
        <div class="chat-peer">
          <span class="chat-peer-name">${character.name}</span>
          <span class="chat-peer-status">
            <span class="status-dot"></span>
            En línea
          </span>
        </div>
        <button class="chat-menu-btn" id="chatMenuBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </button>
        <div class="chat-menu-dropdown" id="chatMenuDropdown">
          <button class="chat-menu-item danger" id="clearChatBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            Vaciar chat
          </button>
        </div>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input-bar">
        <input type="text" class="chat-input" placeholder="Escribe un mensaje...">
        <button class="chat-send">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;

  const messagesContainer = app.querySelector('.chat-messages');
  const input = app.querySelector('.chat-input');
  const button = app.querySelector('.chat-send');
  const menuBtn = app.querySelector('#chatMenuBtn');
  const menuDropdown = app.querySelector('#chatMenuDropdown');
  const clearChatBtn = app.querySelector('#clearChatBtn');

  // Toggle menú de 3 puntos
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle('active');
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', () => {
    menuDropdown.classList.remove('active');
  });

  // Vaciar chat
  clearChatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.classList.remove('active');
    history.length = 0;
    saveHistory();
    renderMessages();
  });

  function renderMessages() {
    messagesContainer.innerHTML = history.map((message) => {
      if (message.isTyping) {
        return `
          <div class="msg typing">
            <div class="msg-avatar"><img src="${character.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>
            <div class="msg-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        `;
      }
      return `
        <div class="msg ${message.role === 'user' ? 'user' : ''}">
          ${message.role === 'assistant' ? `<div class="msg-avatar"><img src="${character.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>` : ''}
          <div class="msg-bubble">
            ${escapeHtml(message.content)}
            <span class="msg-time">${escapeHtml(message.time)}</span>
          </div>
        </div>
      `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function saveHistory() {
    localStorage.setItem(`chatflow-${character.id}`, JSON.stringify(history));
  }

  function appendMessage(message) {
    history.push(message);
    saveHistory();
    renderMessages();
  }

  renderMessages();

  button.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) return;

    const userMessage = { role: 'user', content: value, time: formatTime(new Date()) };
    appendMessage(userMessage);
    input.value = '';

    // Mostrar indicador de typing del personaje
    const typingMessage = { role: 'assistant', content: 'typing', time: formatTime(new Date()), isTyping: true };
    history.push(typingMessage);
    renderMessages();

    // Cambiar estado en header a "Escribiendo..."
    const statusElement = app.querySelector('.chat-peer-status');
    if (statusElement) {
      statusElement.innerHTML = '<span class="status-dot typing-dot"></span>Escribiendo...';
    }

    try {
      await sendChatMessage({
        history: history.slice(0, -1),
        character,
        onReply: (reply) => {
          history[history.length - 1] = { ...reply, time: reply.time || formatTime(new Date()), isTyping: false };
          saveHistory();
          renderMessages();
          // Restaurar estado en header
          if (statusElement) {
            statusElement.innerHTML = '<span class="status-dot"></span>En línea';
          }
        },
        onError: (errorMessage) => {
          history[history.length - 1] = {
            role: 'assistant',
            content: `No pude responder: ${errorMessage}`,
            time: formatTime(new Date()),
            isTyping: false
          };
          saveHistory();
          renderMessages();
          // Restaurar estado en header
          if (statusElement) {
            statusElement.innerHTML = '<span class="status-dot"></span>En línea';
          }
        }
      });
    } catch (error) {
      history[history.length - 1] = {
        role: 'assistant',
        content: `No pude responder: ${error.message}`,
        time: formatTime(new Date()),
        isTyping: false
      };
      saveHistory();
      renderMessages();
      // Restaurar estado en header
      if (statusElement) {
        statusElement.innerHTML = '<span class="status-dot"></span>En línea';
      }
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  });

  // Indicador cuando el usuario está escribiendo
  input.addEventListener('input', () => {
    const statusElement = app.querySelector('.chat-peer-status');
    if (statusElement) {
      if (input.value.trim()) {
        statusElement.innerHTML = '<span class="status-dot user-typing"></span>Escribiendo...';
      } else {
        statusElement.innerHTML = '<span class="status-dot"></span>En línea';
      }
    }
  });
}