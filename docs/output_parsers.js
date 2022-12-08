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
 * Generation-specific output parsers.
 */

import * as prefixes from './prefixes.js';

const PLACE_REGEX = /(Place: )(.*)(.\n)/g;

/**
 * Extracts text from sampled response.
 * @param {Object?} rawSample
 * @return {string}
 */
export function extractText(rawSample) {
  if (!rawSample.choices) return '';
  return rawSample.choices[0].text.trim();
}

/**
 * Extracts title from title response.
 * @param {string} text
 * @return {string}
 */
export function extractTitle(text) {
  text = text.trim();
  if (text.includes(prefixes.END_MARKER)) {
    text = text.split(prefixes.END_MARKER)[0];
  }
  if (text.includes(prefixes.TITLE_ELEMENT)) {
    text = text.split(prefixes.TITLE_ELEMENT)[1];
  }
  if (text.includes(prefixes.EXAMPLE_ELEMENT)) {
    text = text.split(prefixes.EXAMPLE_ELEMENT)[0];
  }
  if (text[text.length - 1] === '.') {
    text = text.slice(0, text.length - 1);
  }
  return text;
}

/**
 * Extracts characters from characters response.
 * @param {string} text
 * @return {string}
 */
export function extractCharacters(text) {
  text = text.replaceAll(prefixes.STOP_MARKER, '');
  if (text.includes(prefixes.END_MARKER)) {
    text = text.split(prefixes.END_MARKER)[0];
  }
  let charactersString = '';
  for (let character of text.split(prefixes.CHARACTER_MARKER)) {
    character = character.trim();
    if (!character.length) continue;
    if (!character.includes(prefixes.DESCRIPTION_MARKER)) continue;
    const characterInfo = character.split(prefixes.DESCRIPTION_MARKER);
    const characterName = characterInfo[0].trim();
    const characterDescription = characterInfo[1].trim();
    charactersString += `${characterName}: ${characterDescription}\n`;
  }
  return charactersString.trim();
}

/**
 * Extracts scene descriptions from scenes response.
 * @param {string} text
 * @return {string}
 */
export function extractScenes(text) {
  if (!text) {
    throw 'No scenes generated, try again.';
  }
  if (text.includes(prefixes.END_MARKER)) {
    text = text.split(prefixes.END_MARKER)[0];
  }
  if (text.includes(prefixes.SCENES_MARKER)) {
    return text.split(prefixes.SCENES_MARKER)[1].trim();
  }
  return text;
}

/**
 * Extracts place names from scenes response.
 * @param {string} scenes
 * @return {!Array<string>}
 */
export function extractPlaceNames(scenes) {
  if (scenes.includes(prefixes.END_MARKER)) {
    scenes = scenes.split(prefixes.END_MARKER)[0];
  }
  const places = [];
  for (const place of scenes.matchAll(PLACE_REGEX)) {
    if (place.length >= 3) {
      places.push(place[2]);
    }
  }
  return places;
}

/**
 * Formats place description from place response.
 * @param {string} description
 * @param {string} prefix
 * @return {string}
 */
export function extractPlace(description, prefix) {
  return `${prefix.trim()}\n${description}`;
}
