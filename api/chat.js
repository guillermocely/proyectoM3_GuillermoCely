/* ============================================================
   API: /api/chat — función serverless con Gemini de Google
   ============================================================ */

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });

  const { messages = [], characterId, systemInstruction } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: 'Configura GEMINI_API_KEY en tu entorno.' });
  }

  // characterId se recibe para validar que la request venga completa desde
  // el frontend (cada personaje tiene su propio systemInstruction armado
  // en el cliente antes de llamar a esta función). No se usa dentro del
  // handler porque el prompt de personalidad ya llega listo en systemInstruction.
  if (!Array.isArray(messages) || !messages.length || !characterId) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemInstruction || 'Eres un asistente útil.',
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.6
      }
    });

    // Se envía el historial completo de la conversación (no solo el último
    // mensaje) para que el modelo mantenga el contexto entre turnos.
    const contents = messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(message.content ?? '') }]
    }));

    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();

    // usageMetadata trae los datos REALES de tokens consumidos en esta
    // llamada (no valores inventados). Si Gemini no lo devuelve por algún
    // motivo, mandamos null para no fingir un dato que no tenemos.
    const usage = response.usageMetadata
      ? {
          promptTokens: response.usageMetadata.promptTokenCount,
          responseTokens: response.usageMetadata.candidatesTokenCount,
          totalTokens: response.usageMetadata.totalTokenCount
        }
      : null;

    return res.status(200).json({
      reply: text.trim(),
      usage
    });
  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    return res.status(500).json({ error: 'Error al conectar con Gemini.', details: error.message });
  }
}