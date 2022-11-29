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
 * Utils for rendering final script.
 */

import * as outputParsers from './output_parsers.js';
import * as promptConstructors from './prompt_constructors.js';

/**
 * Checks if a place appears in an earlier scene.
 * @param {number} index
 * @param {!Array<string>} allNames
 * @return {boolean}
 */
function placeAppearsEarlier(index, allNames) {
  const placeName = allNames[index];
  for (let i = 0; i < index; i++) {
    if (allNames[i] == placeName) return true;
  }
  return false;
}

/**
 * Constructs a map from character names to descriptions.
 * @param {string} characters
 * @return {!Object}
 */
function getCharacterDescriptions(characters) {
  const names = {};
  for (const characterInfo of characters.split('\n')) {
    if (!characterInfo.includes(':')) continue;
    const name = characterInfo.split(':')[0];
    const description = characterInfo.split(':')[1].trim();
    names[name] = description;
  }
  return names;
}

/**
 * Renders story as a script.
 * @param {string} title
 * @param {string} storyline
 * @param {string} scenes
 * @param {string} places
 * @param {string} characters
 * @param {!Array<?HTMLElement>} dialogFields
 * @return {string}
 */
export function renderStory(
    title, storyline, scenes, places, characters, dialogFields) {
  let text = '';
  // Title page
  text += `Title: ${title}\n`;
  text += 'Author: Written by ________ using Dramatron\n';
  text +=
      'Dramatron was developed by Piotr Mirowski and Kory W. Mathewson, based on a prototype by Richard Evans.\n';
  text += '\n\n====\n\n';
  text += `The script is based on the storyline:\n${storyline}\n\n`;
  // Scene information
  const sceneInfo = scenes.split('\n\n');
  for (let i = 0; i < sceneInfo.length; i++) {
    text += `Scene ${i + 1}\n`;
    text += `${sceneInfo[i]}\n\n`;
  }
  text += '\n\n====\n\n';
  // Full script
  const seenCharacters = new Set();
  const placeNames = outputParsers.extractPlaceNames(scenes);
  for (let i = 0; i < sceneInfo.length; i++) {
    text += `INT/EXT. ${placeNames[i]} - Scene ${i + 1}\n\n`;
    // Place description, if the scene is set in a new place
    if (!placeAppearsEarlier(i, placeNames)) {
      const placeDescription =
          promptConstructors.getPlaceDescriptionFromName(places, placeNames[i]);
      text += `${placeDescription}\n\n`;
    }
    // Character descriptions, if there are new characters
    const characterDescriptions = getCharacterDescriptions(characters);
    for (const character in characterDescriptions) {
      if (!seenCharacters.has(character)) {
        text += `${characterDescriptions[character]}\n`;
        seenCharacters.add(character);
      }
    }
    // Dialogue
    text += `\n${dialogFields[i].value}`;
    text += '\n\n====\n\n';
  }
  return text;
}
