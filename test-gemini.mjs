// Chat interactivo de prueba con Gemini: elegis el personaje y conversas.
// Cada personaje conserva su historial (contexto entre mensajes).
// Comandos: "salir" termina, "cambiar" cambia de personaje.
// Uso: node test-gemini.mjs  (desde la raiz del proyecto)
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loki } from './src/characters/loki.js';
import { homerSimpson } from './src/characters/homer-simpson.js';
import { subZero } from './src/characters/sub-zero.js';

const env = readFileSync('.env', 'utf8');
const apiKey = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();

const MODEL = 'gemini-3.5-flash-lite';
const MAX_TOKENS = 50; // prueba: limite bajo para no gastar tokens
const TEMPERATURE = 0.6;
// Se le indica al personaje que cierre la respuesta antes del limite
const SHORT_RESPONSE_NOTE = 'IMPORTANTE: responde siempre de forma breve y concisa, en máximo 50 palabras, y termina tus frases para que la respuesta quede completa.';

const characters = [loki, homerSimpson, subZero];

if (!apiKey) {
  console.error('ERROR: no se encontro GEMINI_API_KEY en el archivo .env');
  process.exit(1);
}

if (apiKey.endsWith('.')) {
  console.error('ERROR: la key termina con un punto (.). Revisa el .env y sacale el punto final.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Un historial por personaje para que cada uno mantenga el contexto
const histories = characters.map((character) => ({ character, history: [] }));

function toGeminiContents(history) {
  return history.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));
}

async function sendToCharacter(item, message) {
  const { character, history } = item;
  history.push({ role: 'user', content: message });

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: character.systemInstruction,
    generationConfig: {
      maxOutputTokens: MAX_TOKENS,
      temperature: TEMPERATURE
    }
  });

  try {
    const result = await model.generateContent({ contents: toGeminiContents(history) });
    const reply = result.response.text().trim();
    history.push({ role: 'assistant', content: reply });
    console.log('');
    console.log('--- ' + character.name + ' ---');
    console.log(reply);
    console.log('--------------------------------------------------');
  } catch (error) {
    console.log('');
    console.log('--- ' + character.name + ' (fallo) ---');
    console.log('Status:', error?.status || 'n/a', '-', error?.message || error);
    console.log('--------------------------------------------------');
  }
}

// Lector de lineas manual (funciona en terminal interactiva y con entrada por pipe)
const rl = createInterface({ input, output, crlfDelay: Infinity });
const lineQueue = [];
const waitingResolvers = [];
let closed = false;

rl.on('line', (line) => {
  const resolve = waitingResolvers.shift();
  if (resolve) resolve(line);
  else lineQueue.push(line);
});

rl.on('close', () => {
  // quedan lineas buffereadas: entregarlas a quien espera
  while (waitingResolvers.length) waitingResolvers.shift()(lineQueue.length ? lineQueue.shift() : '');
  closed = true;
});

function ask(prompt) {
  process.stdout.write(prompt);
  return new Promise((resolve) => {
    if (closed) return resolve(lineQueue.length ? lineQueue.shift() : '');
    if (lineQueue.length) return resolve(lineQueue.shift());
    waitingResolvers.push(resolve);
  });
}

console.log('==============================================');
console.log('CHAT INTERACTIVO CON GEMINI');
console.log('==============================================');
console.log('Modelo:', MODEL, '| Max tokens por respuesta:', MAX_TOKENS, '| Temp:', TEMPERATURE);
console.log('');

outer: while (true) {
  console.log('Elegí un personaje:');
  characters.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
  console.log('  0. Salir');
  console.log('');

  const choice = (await ask('Número (1-' + characters.length + ') o 0 para salir: ')).trim();
  if ((closed && lineQueue.length === 0) || /^(salir|exit|quit|0)$/i.test(choice)) {
    console.log('Chau!');
    break;
  }

  const index = Number(choice) - 1;
  if (!characters[index]) {
    console.log('Opción inválida. Elegí un número del 1 al ' + characters.length + '.');
    console.log('');
    continue;
  }

  const item = histories[index];
  console.log('');
  console.log('Hablando con ' + item.character.name + '.');
  console.log('Escribí "cambiar" para elegir otro personaje o "salir" para terminar.');
  console.log('');

  while (true) {
    const message = (await ask('Tu mensaje: ')).trim();
    if (closed && lineQueue.length === 0) break outer;

    if (!message) continue;

    if (/^(cambiar|switch)$/i.test(message)) {
      console.log('');
      break; // volver al menu de personajes
    }

    if (/^(salir|exit|quit)$/i.test(message)) {
      console.log('Chau!');
      break outer;
    }

    await sendToCharacter(item, message);
    console.log('');
  }
}

rl.close();
