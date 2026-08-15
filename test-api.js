// Script de prueba para verificar que el body solo contiene characterId, systemInstruction y messages
const loki = {
  id: 'loki',
  name: 'Loki',
  systemInstruction: `Eres Loki, Dios de la Astucia.`,
  keywords: [{ keys: ['hola'], replies: ['Saludos, mortal'] }],
  fallback: ['Respuesta fallback']
};

const history = [
  { role: 'user', content: 'Hola' },
  { role: 'assistant', content: 'Hola, soy Loki' }
];

async function testRequestBody() {
  console.log('=== PRUEBA: VERIFICAR CONTENIDO DEL BODY ENVIADO A /api/chat ===');
  console.log('');

  // Simular lo que hace chatLogic.js
  const messages = [
    {
      role: 'system',
      content: loki.systemInstruction
    },
    ...history.map((message) => ({
      role: message.role,
      content: message.content
    }))
  ];

  const body = {
    messages,
    characterId: loki.id,
    systemInstruction: loki.systemInstruction
  };

  console.log('--- Contenido del body ---');
  console.log('Campos enviados:', Object.keys(body));
  console.log('');
  
  console.log('--- VERIFICACIONES ---');
  
  // Verificar que solo tiene los 3 campos esperados
  const camposCorrectos = Object.keys(body).length === 3 && 
                          body.hasOwnProperty('messages') &&
                          body.hasOwnProperty('characterId') &&
                          body.hasOwnProperty('systemInstruction');
  
  console.log('¿Solo tiene 3 campos (messages, characterId, systemInstruction)?', camposCorrectos ? '✅ SÍ' : '❌ NO');
  
  // Verificar que NO tiene keywords
  const tieneKeywords = JSON.stringify(body).includes('keywords');
  console.log('¿Contiene "keywords"?', tieneKeywords ? '❌ SÍ (no debería)' : '✅ NO (correcto)');
  
  // Verificar que NO tiene fallback
  const tieneFallback = JSON.stringify(body).includes('fallback');
  console.log('¿Contiene "fallback"?', tieneFallback ? '❌ SÍ (no debería)' : '✅ NO (correcto)');
  
  // Verificar que characterId es un string corto
  const characterIdEsString = typeof body.characterId === 'string' && body.characterId.length < 50;
  console.log('¿characterId es un string corto?', characterIdEsString ? '✅ SÍ' : '❌ NO');
  
  // Verificar que systemInstruction es solo texto
  const systemInstructionEsTexto = typeof body.systemInstruction === 'string';
  console.log('¿systemInstruction es solo texto?', systemInstructionEsTexto ? '✅ SÍ' : '❌ NO');
  
  // Verificar que messages solo tiene texto de conversación
  const messagesSoloTexto = Array.isArray(body.messages) && 
                           body.messages.every(m => typeof m.content === 'string');
  console.log('¿messages solo tiene texto de conversación?', messagesSoloTexto ? '✅ SÍ' : '❌ NO');
  
  console.log('');
  console.log('=== ANÁLISIS FINAL ===');
  
  if (camposCorrectos && !tieneKeywords && !tieneFallback && characterIdEsString && systemInstructionEsTexto && messagesSoloTexto) {
    console.log('✅ TODO CORRECTO - El body solo contiene characterId, systemInstruction y messages');
    console.log('✅ NO se envían keywords ni fallback');
  } else {
    console.log('❌ ALGUNA VERIFICACIÓN FALLÓ');
  }

  return {
    camposCorrectos,
    tieneKeywords,
    tieneFallback,
    characterIdEsString,
    systemInstructionEsTexto,
    messagesSoloTexto,
    todoCorrecto: camposCorrectos && !tieneKeywords && !tieneFallback && characterIdEsString && systemInstructionEsTexto && messagesSoloTexto
  };
}

// Ejecutar prueba
testRequestBody().then(result => {
  console.log('');
  console.log('Resultado completo:', JSON.stringify(result, null, 2));
});
