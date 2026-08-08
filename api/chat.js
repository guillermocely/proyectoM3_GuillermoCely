/* ============================================================
   API: /api/chat — función serverless (Vercel) - CORREGIDA
   ============================================================ */

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { messages, characterId, systemInstruction } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

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
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.6
      }
    });

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const prompt = lastUserMessage?.content || '';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;

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
