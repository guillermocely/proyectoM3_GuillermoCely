import { buildMessages, formatTime, parseApiResponse } from './utils.js';


// Límite de referencia del free tier de Gemini para gemini-3.5-flash-lite.
// IMPORTANTE: este número lo publica Google y lo cambia con cierta frecuencia —
// confirmá el valor vigente en aistudio.google.com antes de confiar en él.
const TOKENS_POR_MINUTO_LIMITE = 250000;

let tokensAcumuladosSesion = 0;

export async function sendChatMessage({ history, character, onThinking, onReply, onError }) {
  const messages = buildMessages(history, character);

  // El primer elemento de buildMessages() es el prompt de sistema (role: 'system').
  // No lo mandamos dentro de "messages" al backend porque:
  //   1) el backend ya recibe el system prompt aparte, en systemInstruction
  //   2) Gemini espera turnos alternados user/model; dejar el 'system' ahí
  //      adentro rompe esa alternancia y puede hacer que el modelo pierda contexto
  const historyForApi = messages.filter((message) => message.role !== 'system');

  onThinking?.(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: historyForApi,
        characterId: character.id,
        systemInstruction: character.systemInstruction
      })
    });

   const data = await response.json();

if (!response.ok) {
  const apiError = new Error(data?.error || 'Error del servidor');
  apiError.status = response.status;
  throw apiError;
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
    console.warn('[Chat] La llamada a la API falló:', error);

    // El personaje solo responde con la API: si falla, se informa el error
    // (responder.js queda como motor de respuestas locales solo para pruebas)
    let errorMessage = 'No se pudo conectar con el servidor.';

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      errorMessage = 'Sin conexión a Internet.';
    } else if (error.status === 401) {
      errorMessage = 'La clave de API no es válida.';
    } else if (error.status === 403) {
      errorMessage = 'El servidor rechazó el acceso.';
    } else if (error.status >= 500) {
      errorMessage = 'El servidor tiene un problema temporal.';
    }

    onError?.(errorMessage);
  } finally {
    onThinking?.(false);
  }
}