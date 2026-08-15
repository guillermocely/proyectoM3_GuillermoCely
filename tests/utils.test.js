import { describe, it, expect } from 'vitest';
import { buildMessages, parseApiResponse, formatTime, escapeHtml } from '../src/utils.js';

describe('buildMessages', () => {
  it('incluye el prompt del sistema y el historial', () => {
    const character = { id: 'loki', systemInstruction: 'Eres Loki, Dios de la Astucia' };
    const history = [{ role: 'user', content: 'Hola' }];

    const result = buildMessages(history, character);

    expect(result[0]).toMatchObject({ role: 'system', content: 'Eres Loki, Dios de la Astucia' });
    expect(result[1]).toMatchObject({ role: 'user', content: 'Hola' });
  });

  it('usa un prompt de sistema por defecto cuando el personaje no tiene systemInstruction', () => {
    const result = buildMessages([], { id: 'sin-prompt' });

    expect(result[0]).toMatchObject({ role: 'system', content: 'Eres un asistente útil.' });
  });

  it('conserva todos los mensajes del historial en orden', () => {
    const history = [
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: '¡Hola!' },
      { role: 'user', content: '¿Cómo estás?' }
    ];

    const result = buildMessages(history, {});

    expect(result).toHaveLength(4);
    expect(result.slice(1).map((m) => m.content)).toEqual(['Hola', '¡Hola!', '¿Cómo estás?']);
  });
});

describe('parseApiResponse', () => {
  it('devuelve el contenido de reply', () => {
    expect(parseApiResponse({ reply: 'Hola' })).toBe('Hola');
  });

  it('lanza error cuando no hay reply', () => {
    expect(() => parseApiResponse({})).toThrow('Respuesta inválida');
  });
});

describe('formatTime', () => {
  it('formatea una fecha a string legible que incluye año, día y hora', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    const result = formatTime(date);

    expect(typeof result).toBe('string');
    expect(result).toContain('2024');
    expect(result).toContain('15');
    expect(result).toContain('30');
  });
});

describe('escapeHtml', () => {
  it('escapa caracteres HTML peligrosos', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
  });

  it('convierte ampersands primero (evita doble escapado)', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('devuelve string vacío para valores nulos o indefinidos', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('deja texto plano sin cambios', () => {
    expect(escapeHtml('Hola mundo')).toBe('Hola mundo');
  });
});
