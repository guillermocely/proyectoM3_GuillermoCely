/* ============================================================
   API: /api/chat — función serverless (Vercel) - OPENROUTER
   ============================================================ */

import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });

  const { messages, characterId, systemInstruction } = req.body || {};
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) return res.status(200).json({ reply: "Configura OPENROUTER_API_KEY en Vercel." });
  if (!messages?.length || !characterId) return res.status(400).json({ error: 'Datos incompletos' });

  try {
    console.log('🔗 Usando OpenRouter API con OpenAI SDK');
    console.log('📊 Modelo: google/gemini-2.5-flash');
    
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://proyecto-m3-guillermo-cely.vercel.app",
        "X-Title": "Aiflowix",
      }
    });

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const prompt = lastUserMessage?.content || '';

    const formattedMessages = [];
    if (systemInstruction) {
      formattedMessages.push({ role: 'system', content: systemInstruction });
    }
    formattedMessages.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash',
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
    console.error('Error en OpenRouter:', error);
    return res.status(500).json({ error: 'Error al conectar con el modelo.', details: error.message });
  }
}
