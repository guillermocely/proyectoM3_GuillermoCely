/* ============================================================
   MÓDULO: RESPONDER — motor de respuestas (función pura)
   No toca el DOM: ideal para probarlo con tests (vitest).
   Busca palabras clave; si no hay coincidencia, usa fallback.
   ============================================================ */

function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getReply(character, userText) {
    const text = userText.toLowerCase();

    if (character.keywords) {
        for (const rule of character.keywords) {
            if (rule.keys.some(k => text.includes(k))) {
                return pick(rule.replies);
            }
        }
    }
    return pick(character.fallback || ['No entendí eso. ¿Puedes preguntar de otra forma?']);
}
