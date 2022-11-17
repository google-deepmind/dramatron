/**
 * Utilities for making API requests.
 */

import * as outputParsers from './output_parsers.js';
import * as prefixes from './prefixes.js';

const VALIDATION_URL = 'https://api.openai.com/v1/models';
const COMPLETION_URL = 'https://api.openai.com/v1/completions';

const MAX_FAILURES = 5;

const MODEL = 'text-davinci-002';
const MODEL_MAX_LENGTH = 4097; // Maximum input size supported by model.

const TEMPERATURE = 0.99;
const TOP_P = 1;
const FREQUENCY_PENALTY = 0.23;
const PRESENCE_PENALTY = 0.23;
const STOP_SEQUENCES = ['<stop>', '<end>\n\n\n', '<end>'];
const NUM_SAMPLES = 1;

/**
 * Makes simple request to list available models.
 * @param {string} apiKey
 * @return {Object?}
 */
async function makeValidationRequest(apiKey) {
  const response = await fetch(VALIDATION_URL, {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    referrerPolicy: 'no-referrer',
  });
  return response.json();
}

/**
 * Makes trivial request to check if API key is valid.
 * @param {string} apiKey
 * @return {boolean}
 */
export async function validateKey(apiKey) {
  const listResponse = await makeValidationRequest(apiKey);
  return listResponse.data !== undefined;
}

/**
 * Constructs API request.
 * @param {string} prompt
 * @param {number} sampleLength
 * @return {!Object}
 */
function createRequest(prompt, sampleLength) {
  const request = {
    model: MODEL,
    prompt: prompt,
    temperature: TEMPERATURE,
    max_tokens: sampleLength,
    top_p: TOP_P,
    frequency_penalty: FREQUENCY_PENALTY,
    presence_penalty: PRESENCE_PENALTY,
    stop: STOP_SEQUENCES,
    n: NUM_SAMPLES,
  };
  return request;
}

/**
 * Calls GPT-3 API.
 * @param {string} apiKey
 * @param {string} prompt
 * @param {number} sampleLength
 * @return {Object?}
 */
async function getResponse(apiKey, prompt, sampleLength) {
  const request = createRequest(prompt, sampleLength);
  const response = await fetch(COMPLETION_URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(request),
  });
  return response.json();
}

/**
 * Gets completion.
 * @param {string} apiKey
 * @param {string} generationPrompt
 * @param {number} sampleLength
 * @param {number} maxLength
 * @return {string}
 */
export async function getCompletion(
    apiKey, generationPrompt, sampleLength, maxLength) {
  const maxNumCalls = Math.round(maxLength / sampleLength) + 1;
  let numCalls = 0;
  let result = '';
  while (numCalls < maxNumCalls && result.length < maxLength) {
    const prompt = `${generationPrompt}${result}`;
    const maxSupportedLength = MODEL_MAX_LENGTH - prompt.length;
    const generationLength = Math.min(maxSupportedLength, sampleLength);
    // Stop if the context size exceeds the maximum length supported by the
    // model.
    if (generationLength < 0) return result;
    const sampledResult = await getResponse(apiKey, prompt, generationLength);
    const sampledText = outputParsers.extractText(sampledResult);
    // Stop if the result is empty.
    if (!sampledText) return result;
    // Stop if the model generates the beginning of a new example.
    if (sampledText.startsWith(prefixes.EXAMPLE_ELEMENT)) return result;
    result += `${sampledText} `;
  }
  return result;
}

/**
 * Retries sample multiple times in case of processing errors.
 * @param {string} apiKey
 * @param {string} generationPrompt
 * @param {number} sampleLength
 * @param {number} maxLength
 * @param {function(string)} successFunction
 * @return {string}
 */
export async function sampleUntilSuccess(
    apiKey, generationPrompt, sampleLength, maxLength, successFunction) {
  let failures = 0;
  while (failures < MAX_FAILURES) {
    try {
      const response = await getCompletion(
          apiKey, generationPrompt, sampleLength, maxLength);
      const value = successFunction(response);
      return value;
    } catch (err) {
      failures += 1;
    }
  }
  return undefined;
}
