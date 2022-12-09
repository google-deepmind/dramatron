// Copyright 2022 DeepMind Technologies Limited.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Utilities for making API requests.
 */

import * as outputParsers from './output_parsers.js';
import * as prefixes from './prefixes.js';

const VALIDATION_URL = 'https://api.openai.com/v1/models';
const COMPLETION_URL = 'https://api.openai.com/v1/completions';
const PERSPECTIVE_URL =
    'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

const PERSPECTIVE_THRESHOLD = 0.8;

const MAX_FAILURES = 5;
const REQUEST_TIMEOUT = 60 * 1000; // 60 seconds.

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

/** Error raised when the LM returns a dangerous response. */
export const PERSPECTIVE_ERROR = 'perspective_error';

/** Error raised when request times out. */
export const TIMEOUT_ERROR = 'timeout_error';

/** Error raised when user provides invalid credentials. */
export const CREDENTIALS_ERROR = 'invalid_request_error';

/** Error raised when user provides key without quota. */
export const QUOTA_ERROR = 'insufficient_quota';

/** Response returned when user authenticates successfully. */
export const REQUEST_OK = 'request_ok';

/**
 * Makes API request with a timeout.
 * @param {string} url
 * @param {Object?} params
 * @return {Object?}
 */
async function makeRequestWithTimeout(url, params) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  params.signal =  controller.signal;
  try {
    const response = await fetch(url, params);
    clearTimeout(id);
    return response.json();
  } catch (err) {
    return {};
  }
}

/**
 * Makes trivial request to check if GPT-3 API key is valid.
 * @param {string} apiKey
 * @return {string}
 */
export async function validateGpt3Key(apiKey) {
  const response = await getResponse(apiKey, '', 1);
  if (response.error !== undefined) {
    return response.error.type;
  }
  return REQUEST_OK;
}

/**
 * Constructs Perspective API request.
 * @param {string} text
 * @return {!Object}
 */
function createPerspectiveRequest(text) {
  const request = {
    comment: {text},
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      IDENTITY_ATTACK: {},
      INSULT: {},
      SEXUALLY_EXPLICIT: {},
    },
  };
  return request;
}

/**
 * Makes a request to the Perspective API.
 * @param {!Object} request
 * @param {string} perspectiveKey
 * @return {Object?}
 */
async function getPerspectiveResponse(request, perspectiveKey) {
  const url = `${PERSPECTIVE_URL}?key=${perspectiveKey}`;
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
 * Determines if response is above the thresholds for dangerous content.
 * @param {Object?} response
 * @return {boolean}
 */
function sanitize(response) {
  const scores = response.attributeScores;
  const toxicity = scores.TOXICITY.summaryScore.value;
  if (toxicity > PERSPECTIVE_THRESHOLD) return true;
  const severeToxicity = scores.SEVERE_TOXICITY.summaryScore.value;
  if (severeToxicity > PERSPECTIVE_THRESHOLD) return true;
  const identity_attack = scores.IDENTITY_ATTACK.summaryScore.value;
  if (identity_attack > PERSPECTIVE_THRESHOLD) return true;
  const insult = scores.INSULT.summaryScore.value;
  if (insult > PERSPECTIVE_THRESHOLD) return true;
  const explicit = scores.SEXUALLY_EXPLICIT.summaryScore.value;
  if (explicit > PERSPECTIVE_THRESHOLD) return true;
  return false;
}

/**
 * Sanitizes a response with the Perspective API.
 * @param {string} text
 * @param {string} perspectiveKey
 * @return {boolean}
 */
async function shouldHide(text, perspectiveKey) {
  if (!perspectiveKey) return false;
  const request = createPerspectiveRequest(text);
  const response = await getPerspectiveResponse(request, perspectiveKey);
  const isDangerous = sanitize(response);
  return isDangerous;
}

/**
 * Makes trivial request to check if Perspective API key is valid.
 * @param {string} apiKey
 * @return {boolean}
 */
export async function validatePerspectiveKey(apiKey) {
  try {
    await shouldHide('placeholder text', apiKey);
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
  const response = await makeRequestWithTimeout(COMPLETION_URL, {
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
  return response;
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
    if (Object.keys(sampledResult).length === 0) {
      return TIMEOUT_ERROR;
    }
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
      if (response === TIMEOUT_ERROR) {
        return response;
      }
      const value = successFunction(response);
      const isDangerous = await shouldHide(value, perspectiveKey);
      if (isDangerous) return PERSPECTIVE_ERROR;
      return value;
    } catch (err) {
      failures += 1;
    }
  }
  return GENERATION_ERROR;
}
