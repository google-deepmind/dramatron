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

/*
 * Construct specific prompts for each stage of generation.
 */

import * as prefixes from './prefixes.js';


/**
 * Gets the place description from its name.
 * @param {!Array<string>} places
 * @param {string} placeName
 * @return {string}
 */
export function getPlaceDescriptionFromName(places, placeName) {
  for (const place of places.split('\n\n')) {
    if (place.includes(placeName.slice(0, -1))) {
      return place.split('\n')[1];
    }
  }
  return undefined;
}

/**
 * Gets character descriptions from names and descriptions.
 * @param {string} characters
 * @return {string}
 */
function getCharacterDescriptions(characters) {
  const characterInfo = characters.split('\n');
  let descriptions = '';
  for (const character of characterInfo) {
    descriptions += `${character.split(': ')[1]}\n`;
  }
  return descriptions;
}


/**
 * Constructs the prompt for dialogue generation.
 * @param {number} sceneIndex
 * @param {string} scenes
 * @param {string} places
 * @param {string} characters
 * @param {string} storyline
 * @return {string}
 */
export function createDialogPrompt(
    sceneIndex, scenes, places, characters, storyline) {
  let prompt = prefixes.DIALOG_PROMPT;
  const sceneDescriptions = scenes.split(prefixes.PLACE_ELEMENT.trim());
  const sceneInfo = sceneDescriptions[sceneIndex];

  // Place: The bar.
  const placeName = sceneInfo.split('\n')[0].trim();
  prompt += `${prefixes.PLACE_ELEMENT}${placeName}\n`;
  // Description: The bar is dirty, more than a little run down. If there is...
  const placeDescription = getPlaceDescriptionFromName(places, placeName);
  if (placeDescription !== undefined) {
    prompt += `${prefixes.DESCRIPTION_ELEMENT}${placeDescription}\n`;
  }
  // Characters: Jerry is in his 30s, sallow, a bit puffy. His hair is a...
  const characterDescriptions = getCharacterDescriptions(characters);
  prompt += `${prefixes.CHARACTERS_ELEMENT}${characterDescriptions}\n`;
  // Plot element: Middle.
  prompt += `${sceneInfo.split('\n')[1].trim()}\n`;
  // Summary: Jerry falls in love with Lydia.
  prompt += `${prefixes.SUMMARY_ELEMENT}${storyline}\n`;
  // Previous beat: Lydia notices Jerry sitting at the bar and makes small...
  if (sceneIndex > 1) {
    const previousScene = sceneDescriptions[sceneIndex - 1];
    const previousBeat = previousScene.split(prefixes.BEAT_ELEMENT)[1].trim();
    prompt += `${prefixes.PREVIOUS_ELEMENT}${previousBeat}\n`;
  }
  // Beat: Jerry tells Lydia the story of his proposal. Jerry tells Lydia...
  const currentBeat = sceneInfo.split(prefixes.BEAT_ELEMENT)[1].trim();
  prompt += `${prefixes.BEAT_ELEMENT}${currentBeat}\n\n`;

  prompt += `${prefixes.DIALOG_MARKER}\n\n`;
  return prompt;
}

/**
 * Constructs the prompt for dialog continuation.
 * @param {number} sceneIndex
 * @param {string} scenes
 * @param {string} places
 * @param {string} characters
 * @param {string} storyline
 * @param {string} dialog
 * @return {string}
 */
export function createDialogContinuationPrompt(
    sceneIndex, scenes, places, characters, storyline, dialog) {
  const basePrompt =
      createDialogPrompt(sceneIndex, scenes, places, characters, storyline);
  return `${basePrompt}${dialog.trim()}\n\n`;
}

/**
 * Constructs the prompt for scene generation.
 * @param {string} storyline
 * @param {string} characters
 * @return {string}
 */
export function createScenesPrompt(storyline, characters) {
  return `${prefixes.SCENE_PROMPT}${storyline}\n${characters}\n${prefixes.SCENES_MARKER}\n`;
}
