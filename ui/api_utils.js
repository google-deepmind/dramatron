/**
 * Utilities for making API requests.
 */

import * as outputParsers from './output_parsers.js';
import * as prefixes from './prefixes.js';

const VALIDATION_URL = 'https://api.openai.com/v1/models';
const COMPLETION_URL = 'https://api.openai.com/v1/completions';
const TOXICITY_URL =
    'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

const TOXICITY_THRESHOLD = 0.7;

const MAX_FAILURES = 5;

const MODEL = 'text-davinci-002';
const MODEL_MAX_LENGTH = 4097; // Maximum input size supported by model.

const TEMPERATURE = 0.99;
const TOP_P = 1;
const FREQUENCY_PENALTY = 0.23;
const PRESENCE_PENALTY = 0.23;
const STOP_SEQUENCES = ['<stop>', '<end>\n\n\n', '<end>'];
const NUM_SAMPLES = 1;

/** Error raised when the LM fails to generate well-formed text. */
export const GENERATION_ERROR = 'generation_error';

/** Error raised when the LM returns a toxic response. */
export const TOXICITY_ERROR = 'toxicity_error';

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
 * Makes trivial request to check if GPT-3 API key is valid.
 * @param {string} apiKey
 * @return {boolean}
 */
export async function validateGpt3Key(apiKey) {
  const listResponse = await makeValidationRequest(apiKey);
  return listResponse.data !== undefined;
}

/**
 * Constructs Perspective API request.
 * @param {string} text
 * @return {!Object}
 */
function createToxicityRequest(text) {
  const request = {
    comment: {text},
    requestedAttributes: {TOXICITY: {}},
  };
  return request;
}

/**
 * Makes a request to the Perspective API.
 * @param {!Object} request
 * @param {string} perspectiveKey
 * @return {Object?}
 */
async function getToxicityResponse(request, perspectiveKey) {
  const url = `${TOXICITY_URL}?key=${perspectiveKey}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${perspectiveKey}`,
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(request),
  });
  return response.json();
}

/**
 * Determines if response is above toxicity threshold.
 * @param {Object?} response
 * @return {boolean}
 */
function extractToxicity(response) {
  const score = response.attributeScores.TOXICITY.summaryScore.value;
  return score > TOXICITY_THRESHOLD;
}

/**
 * Sanitizes a response with the Perspective API.
 * @param {string} text
 * @param {string} perspectiveKey
 * @return {boolean}
 */
async function isToxic(text, perspectiveKey) {
  if (!perspectiveKey) return false;
  const request = createToxicityRequest(text);
  const response = await getToxicityResponse(request, perspectiveKey);
  const toxic = extractToxicity(response);
  return toxic;
}

/**
 * Makes trivial request to check if Perspective API key is valid.
 * @param {string} apiKey
 * @return {boolean}
 */
export async function validatePerspectiveKey(apiKey) {
  try {
    await isToxic('placeholder text', apiKey);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Constructs GPT-3 API request.
 * @param {string} prompt
 * @param {number} sampleLength
 * @return {!Object}
 */
function createCompletionRequest(prompt, sampleLength) {
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
  const request = createCompletionRequest(prompt, sampleLength);
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
 * @param {string?} perspectiveKey
 * @return {string}
 */
export async function sampleUntilSuccess(
    apiKey, generationPrompt, sampleLength, maxLength, successFunction,
    perspectiveKey) {
  let failures = 0;
  while (failures < MAX_FAILURES) {
    try {
      const response = await getCompletion(
          apiKey, generationPrompt, sampleLength, maxLength);
      const value = successFunction(response);
      const toxic = await isToxic(value, perspectiveKey);
      if (toxic) return TOXICITY_ERROR;
      return value;
    } catch (err) {
      failures += 1;
    }
  }
  return GENERATION_ERROR;
}
