export function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  return data.reply;
}
