import { describe, it, expect } from 'vitest';
import { buildMessages, parseApiResponse } from '../src/utils.js';

describe('buildMessages', () => {
  it('incluye el prompt del sistema y el historial', () => {
    const character = { id: 'iron-man', systemPrompt: 'Eres Tony Stark' };
    const history = [{ role: 'user', content: 'Hola' }];

    const result = buildMessages(history, character);

    expect(result[0]).toMatchObject({ role: 'system', content: 'Eres Tony Stark' });
    expect(result[1]).toMatchObject({ role: 'user', content: 'Hola' });
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
