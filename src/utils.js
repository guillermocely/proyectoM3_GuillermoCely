export function formatTime(date = new Date()) {
  return date.toLocaleString([], { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function truncateResponse(text, maxLength = 300) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function buildMessages(history, character) {
  const systemPrompt = character?.systemPrompt || 'Eres un asistente útil.';
  return [
    {
      role: 'system',
      content: systemPrompt
    },
    ...history.map((message) => ({
      role: message.role,
      content: message.content
    }))
  ];
}

export function parseApiResponse(data) {
  if (!data?.reply) {
    throw new Error('Respuesta inválida');
  }
  // Truncar respuesta para controlar longitud mostrada
  return truncateResponse(data.reply, 300);
}
