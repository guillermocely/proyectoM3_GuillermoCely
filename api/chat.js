/* ============================================================
   API: /api/chat — función serverless (Vercel)
   Usa el SDK de Google (@google/generative-ai) para conectar con Gemini AI.
   La app usa este endpoint con respaldo local en src/characters/.
   ============================================================ */

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { messages, characterId, systemInstruction } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  // Si no hay API key, responder con placeholder
  if (!apiKey) {
    const lastUserMessage = messages?.filter(m => m.role === 'user')?.pop()?.content || '';
    return res.status(200).json({
      reply: `Endpoint de ejemplo: conecta aquí tu modelo de IA. Tu mensaje fue: "${lastUserMessage}". Configura GEMINI_API_KEY en .env para usar Gemini AI.`
    });
  }

  if (!messages?.length || !characterId) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite'
    });

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const prompt = lastUserMessage?.content || '';

    // Construir el prompt con la instrucción del sistema
    const fullPrompt = systemInstruction
      ? `${systemInstruction}\n\nUsuario: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt, {
      generationConfig: {
        maxOutputTokens: 107,
        temperature: 0.6
      }
    });
    const response = await result.response;
    const text = response.text();

    // usageMetadata viene directo de Gemini: cuánto costó ESTA llamada puntual
    const usage = response.usageMetadata;
    console.log('--- Tokens de esta llamada ---');
    console.log('Prompt:', usage?.promptTokenCount);
    console.log('Respuesta:', usage?.candidatesTokenCount);
    console.log('Total:', usage?.totalTokenCount);

    return res.status(200).json({
      reply: text.trim(),
      usage: {
        promptTokens: usage?.promptTokenCount ?? 0,
        outputTokens: usage?.candidatesTokenCount ?? 0,
        totalTokens: usage?.totalTokenCount ?? 0
      }
    });
  } catch (error) {
    console.error('Gemini error', error?.message || error);
    return res.status(200).json({
      reply: 'Error al conectar con Gemini. Por favor configura GEMINI_API_KEY en .env o verifica tu conexión.'
    });
  }
}
