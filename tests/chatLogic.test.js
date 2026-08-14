import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendChatMessage } from '../src/chatLogic.js';

// Personaje de prueba
const character = {
  id: 'iron-man',
  systemInstruction: 'Eres Tony Stark',
  greeting: 'Hola, soy Iron Man'
};

describe('sendChatMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('envía el historial completo de la conversación a /api/chat, no solo el último mensaje', async () => {
    const history = [
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: '¡Hola! ¿En qué te ayudo?' },
      { role: 'user', content: '¿Cómo te llamás?' }
    ];

    let capturedBody = null;
    global.fetch = vi.fn().mockImplementation((url, options) => {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: 'Soy Tony Stark', usage: { totalTokens: 42 } })
      });
    });

    await sendChatMessage({ history, character, onThinking: () => {}, onReply: () => {} });

    // El historial completo (los 3 mensajes) debe llegar dentro de "messages"
    expect(capturedBody.messages).toHaveLength(3);
    expect(capturedBody.messages[0]).toMatchObject({ role: 'user', content: 'Hola' });
    expect(capturedBody.messages[2]).toMatchObject({ role: 'user', content: '¿Cómo te llamás?' });
  });

  it('no incluye un mensaje con role "system" dentro de "messages" (ya viaja aparte en systemInstruction)', async () => {
    const history = [{ role: 'user', content: 'Hola' }];

    let capturedBody = null;
    global.fetch = vi.fn().mockImplementation((url, options) => {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: 'Hola de nuevo', usage: null })
      });
    });

    await sendChatMessage({ history, character, onThinking: () => {}, onReply: () => {} });

    const hasSystemRole = capturedBody.messages.some((m) => m.role === 'system');
    expect(hasSystemRole).toBe(false);
    expect(capturedBody.systemInstruction).toBe('Eres Tony Stark');
  });

  it('usa respuesta local (fallback) si la API falla, sin romper la conversación', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    let received = null;
    await sendChatMessage({
      history: [{ role: 'user', content: 'Hola' }],
      character,
      onThinking: () => {},
      onReply: (msg) => { received = msg; }
    });

    expect(received).not.toBeNull();
    expect(received.role).toBe('assistant');
    expect(typeof received.content).toBe('string');
  });
});