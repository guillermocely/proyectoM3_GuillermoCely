import { buildMessages, formatTime, parseApiResponse } from './utils.js';
import { getReply } from './characters/responder.js';

// Límite de referencia del free tier de Gemini para gemini-3.5-flash-lite.
// IMPORTANTE: este número lo publica Google y lo cambia con cierta frecuencia —
// confirmá el valor vigente en aistudio.google.com antes de confiar en él.
const TOKENS_POR_MINUTO_LIMITE = 250000;

let tokensAcumuladosSesion = 0;

export async function sendChatMessage({ history, character, onThinking, onReply, onError }) {
  const messages = buildMessages(history, character);
  onThinking?.(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        characterId: character.id,
        systemInstruction: character.systemInstruction
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'No se pudo enviar el mensaje');
    }

    const reply = parseApiResponse(data);

    // Sumamos los tokens de esta llamada al acumulado de la sesión
    if (data.usage?.totalTokens) {
      tokensAcumuladosSesion += data.usage.totalTokens;
      const disponiblesEstimados = TOKENS_POR_MINUTO_LIMITE - tokensAcumuladosSesion;

      console.log('--- Consumo de esta sesión ---');
      console.log('Tokens de este mensaje:', data.usage.totalTokens);
      console.log('Acumulado en la sesión:', tokensAcumuladosSesion);
      console.log('Disponibles estimados (sobre el límite por minuto):', disponiblesEstimados);
    }

    onReply?.({
      role: 'assistant',
      content: reply,
      time: formatTime(new Date())
    });
  } catch (error) {
    console.warn('[Chat] API falló, usando respuestas locales:', error);
    // Usar respuestas locales como respaldo
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const localReply = lastUserMessage ? getReply(character, lastUserMessage.content) : character.greeting || 'Hola';
    onReply?.({
      role: 'assistant',
      content: localReply,
      time: formatTime(new Date())
    });
  } finally {
    onThinking?.(false);
  }
}
