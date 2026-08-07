export function formatTime(date = new Date()) {
  return date.toLocaleString([], { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function buildMessages(history, character) {
  const systemInstruction = character?.systemInstruction || 'Eres un asistente útil.';
  return [
    {
      role: 'system',
      content: systemInstruction
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
  return data.reply;
}
