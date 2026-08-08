/* ============================================================
   API: /api/chat — función serverless (Vercel) - OPENROUTER
   ============================================================ */

import { OpenRouter } from '@openrouter/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { messages, characterId, systemInstruction } = req.body || {};
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const lastUserMessage = messages?.filter(m => m.role === 'user')?.pop()?.content || '';
    return res.status(200).json({
      reply: `Endpoint de ejemplo: conecta aquí tu modelo de IA. Tu mensaje fue: "${lastUserMessage}". Configura OPENROUTER_API_KEY en .env para usar OpenRouter.`
    });
  }

  if (!messages?.length || !characterId) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const client = new OpenRouter({ 
      apiKey: apiKey,
      httpReferer: 'https://proyecto-m3-guillermo-cely.vercel.app',
      appTitle: 'Aiflowix'
    });

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const prompt = lastUserMessage?.content || '';

    const formattedMessages = [];
    if (systemInstruction) {
      formattedMessages.push({ role: 'system', content: systemInstruction });
    }
    formattedMessages.push({ role: 'user', content: prompt });

    const completion = await client.chat.send({
      model: 'google/gemini-flash-1.5',
      messages: formattedMessages,
      temperature: 0.6,
      max_tokens: 100
    });

    const text = completion.choices?.[0]?.message?.content || '';
    const usage = completion.usage;

    return res.status(200).json({
      reply: text.trim(),
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        outputTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0
      }
    });
  } catch (error) {
    console.error('OpenRouter error', error?.message || error);
    return res.status(200).json({
      reply: 'Error al conectar con OpenRouter. Por favor configura OPENROUTER_API_KEY en .env o verifica tu conexión.'
    });
  }
}
