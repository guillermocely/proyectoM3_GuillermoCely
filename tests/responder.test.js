import { describe, it, expect } from 'vitest';
import { getReply } from '../src/characters/responder.js';

const character = {
  id: 'test',
  keywords: [
    { keys: ['hola', 'buenas'], replies: ['¡Hola!', 'Buenas, ¿qué tal?'] },
    { keys: ['adios', 'chau'], replies: ['¡Adiós!'] }
  ],
  fallback: ['No entendí. ¿Podés reformular?']
};

describe('getReply', () => {
  it('responde con una de las respuestas de la palabra clave encontrada', () => {
    const reply = getReply(character, 'Hola, ¿cómo estás?');
    expect(['¡Hola!', 'Buenas, ¿qué tal?']).toContain(reply);
  });

  it('coincide sin distinguir mayúsculas ni minúsculas', () => {
    const reply = getReply(character, 'ADIOS');
    expect(reply).toBe('¡Adiós!');
  });

  it('usa el fallback cuando ninguna palabra clave coincide', () => {
    const reply = getReply(character, 'cualquier otra cosa');
    expect(reply).toBe('No entendí. ¿Podés reformular?');
  });

  it('usa un fallback por defecto si el personaje no define fallback', () => {
    const minimal = { id: 'min' };
    const reply = getReply(minimal, 'hola');
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(0);
  });
});
