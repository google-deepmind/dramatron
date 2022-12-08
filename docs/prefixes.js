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
 * Prefixes for generation.
 */

export const END_MARKER = '<end>';
export const STOP_MARKER = '<stop>';

export const CHARACTER_MARKER = '<character>';
export const DESCRIPTION_MARKER = '<description>';
export const SCENES_MARKER = '<scenes>';
export const DIALOG_MARKER = '<dialog>';

export const EXAMPLE_ELEMENT = 'Example ';
export const TITLE_ELEMENT = 'Title: ';
export const CHARACTERS_ELEMENT = 'Characters: ';
export const DESCRIPTION_ELEMENT = 'Description: ';
export const PLACE_ELEMENT = 'Place: ';
export const PLOT_ELEMENT = 'Plot element: ';
export const SUMMARY_ELEMENT = 'Summary: ';
export const PREVIOUS_ELEMENT = 'Previous beat: ';
export const BEAT_ELEMENT = 'Beat: ';

export const CHARACTERS_PROMPT = `
Example 1. A science-fiction fantasy about a naive but ambitious farm boy from a backwater desert who discovers powers he never knew he had when he teams up with a feisty princess, a mercenary space pilot and an old wizard warrior to lead a ragtag rebellion against the sinister forces of the evil Galactic Empire.
${CHARACTER_MARKER}Luke Skywalker ${DESCRIPTION_MARKER}Luke Skywalker is the hero. A naive farm boy, he will discover special powers under the guidance of mentor Ben Kenobi.${STOP_MARKER}
${CHARACTER_MARKER}Ben Kenobi ${DESCRIPTION_MARKER}Ben Kenobi is the mentor figure. A recluse Jedi warrior, he will take Luke Skywalker as apprentice.${STOP_MARKER}
${CHARACTER_MARKER}Darth Vader ${DESCRIPTION_MARKER}Darth Vader is the antagonist. As a commander of the evil Galactic Empire, he controls space station The Death Star.${STOP_MARKER}
${CHARACTER_MARKER}Princess Leia ${DESCRIPTION_MARKER}Princess Leia is a feisty and brave leader of the Rebellion. She holds the plans of the Death Star. She will become Luke's friend.${STOP_MARKER}
${CHARACTER_MARKER}Han Solo ${DESCRIPTION_MARKER}Han Solo is a brash mercenary space pilot of the Millenium Falcon and a friend of Chebacca. He will take Luke on his spaceship.${STOP_MARKER}
${CHARACTER_MARKER}Chewbacca ${DESCRIPTION_MARKER}Chewbacca is a furry and trustful monster. He is a friend of Han Solo and a copilot on the Millemium Falcon.${STOP_MARKER}
${END_MARKER}

Example 2. `

export const SCENE_PROMPT = `
Example 1. A science-fiction fantasy about a naive but ambitious farm boy from a backwater desert who discovers powers he never knew he had when he teams up with a feisty princess, a mercenary space pilot and an old wizard warrior to lead a ragtag rebellion against the sinister forces of the evil Galactic Empire.
Luke Skywalker is the hero. A naive farm boy, he will discover special powers under the guidance of mentor Ben Kenobi.
Ben Kenobi is the mentor figure. A recluse Jedi warrior, he will take Luke Skywalker as apprentice.
Darth Vader is the antagonist. As a commander of the evil Galactic Empire, he controls space station The Death Star.
Princess Leia holds the plans of the Death Star. She is feisty and brave. She will become Luke's friend.
Han Solo is a brash mercenary space pilot of the Millenium Falcon and a friend of Chebacca. He will take Luke on his spaceship.
Chewbacca is a furry and trustful monster. He is a friend of Han Solo and a copilot on the Millemium Falcon.

${SCENES_MARKER}

${PLACE_ELEMENT}A farm on planet Tatooine.
${PLOT_ELEMENT}The Ordinary World.
Beat: Luke Skywalker is living a normal and humble life as a farm boy on his home planet.

${PLACE_ELEMENT}Desert of Tatooine.
${PLOT_ELEMENT}Call to Adventure.
Beat: Luke is called to his adventure by robot R2-D2 and Ben Kenobi. Luke triggers R2-D2’s message from Princess Leia and is intrigued by her message. When R2-D2 escapes to find Ben Kenobi, Luke follows and is later saved by Kenobi, who goes on to tell Luke about his Jedi heritage. Kenobi suggests that he should come with him.

${PLACE_ELEMENT}On space station The Death Star.
${PLOT_ELEMENT}The Ordeal.
Beat: As Kenobi goes off to deactivate the tractor beam so they can escape, Luke, Han, and Chewbacca discover that Princess Leia is being held on the Death Star with them. They rescue her and escape to the Millennium Falcon, hoping that Kenobi has successfully deactivated the tractor beam. Kenobi later sacrifices himself as Luke watches Darth Vader strike him down. Luke must now avenge his fallen mentor and carry on his teachings.

${PLACE_ELEMENT}At the Rebellion base.
${PLOT_ELEMENT}The Return.
Beat: Luke and Han return to the Rebellion base, triumphant, as they receive medals for the heroic journey. There is peace throughout the galaxy — at least for now.${END_MARKER}

Example 2. `;

export const SETTING_PROMPT = `
Example 1. Morgan adopts a new cat, Misterio, who sets a curse on anyone that pets them.
${PLACE_ELEMENT}The Adoption Center.
${DESCRIPTION_ELEMENT}The Adoption Center is a sad place, especially for an unadopted pet. It is full of walls and walls of cages and cages. Inside of each is an abandoned animal, longing for a home. The lighting is dim, gray, buzzing fluorescent.${END_MARKER}

Example 2. James finds a well in his backyard that is haunted by the ghost of Sam.
${PLACE_ELEMENT}The well.
${DESCRIPTION_ELEMENT}The well is buried under grass and hedges. It is at least twenty feet deep, if not more and it is masoned with stones. It is 150 years old at least. It stinks of stale, standing water, and has vines growing up the sides. It is narrow enough to not be able to fit down if you are a grown adult human.${END_MARKER}

Example 3. Mr. Dorbenson finds a book at a garage sale that tells the story of his own life. And it ends in a murder!
${PLACE_ELEMENT}The garage sale.
${DESCRIPTION_ELEMENT}It is a garage packed with dusty household goods and antiques. There is a box at the back that says FREE and is full of paper back books.${END_MARKER}

Example 4. `;

export const TITLES_PROMPT = `
Examples of alternative, original and descriptive titles for known play and film scripts.

Example 1. A science-fiction fantasy about a naive but ambitious farm boy from a backwater desert who discovers powers he never knew he had when he teams up with a feisty princess, a mercenary space pilot and an old wizard warrior to lead a ragtag rebellion against the sinister forces of the evil Galactic Empire. Title: The Death Star's Menace${END_MARKER}

Example 2. Residents of San Fernando Valley are under attack by flying saucers from outer space. The aliens are extraterrestrials who seek to stop humanity from creating a doomsday weapon that could destroy the universe and unleash the living dead to stalk humans who wander into the cemetery looking for evidence of the UFOs. The hero Jeff, an airline pilot, will face the aliens. Title: The Day The Earth Was Saved By Outer Space.${END_MARKER}

Example 3. `;

export const DIALOG_PROMPT = `
Example 1.
${PLACE_ELEMENT}Cockpit of an airplane.
${DESCRIPTION_ELEMENT}Cockpit of a modern passenger airplane, American Flight 812.
${CHARACTERS_ELEMENT}Jeff is the hero. A man in his early forties, he tries to stay calm in all circumstance. Jeff is now a airline pilot. Danny, a young airplane pilot in his thirties, is eager to learn but can quickly lose his composture. Danny is enamored of Edith. Edith, an experienced stewardess with a good sense of humour, is trustworthy and dependable. Edith likes to tease Danny.
${PLOT_ELEMENT}Crossing the First Threshold.
${SUMMARY_ELEMENT}Residents of San Fernando Valley are under attack by flying saucers from outer space. The aliens are extraterrestrials who seek to stop humanity from creating a doomsday weapon that could destroy the universe and unleash the living dead to stalk humans who wander into the cemetery looking for evidence of the UFOs. The hero Jeff, an airline pilot, will face the aliens.
${PREVIOUS_ELEMENT}Flight captain Jeff reluctantly leaves his wife Paula to go for a two-day flight.
${BEAT_ELEMENT}At the cockpit, flight captain Jeff is preoccupied by the flying saucer appearances and graveyard incidents in his home town, where he left wis wife Paula. Without success, co-pilot Danny and stewardess Edith try to reassure him.

${DIALOG_MARKER}

DANNY
You're mighty silent this trip, Jeff.

JEFF
Huh?

DANNY
You haven't spoken ten words since takeoff.

JEFF
I guess I'm preoccupied, Danny.

DANNY
We've got thirty-three passengers back there that have time to be preoccupied.
Flying this flybird doesn't give you that opportunity.

JEFF
I guess you're right, Danny.

DANNY
Paula?

JEFF
Yeah.

DANNY
There's nothing wrong between you two?

JEFF
Oh no, nothing like that.  Just that I'm worried, she being there alone and
those strange things flying over the house and those incidents in the graveyard
the past few days. It's just got me worried.

DANNY
Well, I haven't figured out those crazy skybirds yet but I give you fifty to one
odds the police have figured out that cemetery thing by now.

(Enter EDITH)

JEFF
I hope so.

EDITH
If you're really that worried Jeff why don't you radio in and find out? Mac
should be on duty at the field by now. He could call Paula and relay the message
to you.

DANNY
Hi Edith.

EDITH
Hi Silents. I haven't heard a word from this end of the plane since we left the
field.

DANNY
Jeff's been giving me and himself a study in silence.

EDITH
You boys are feudin'?

JEFF
Oh no Edie, nothing like that.

Example 2.
`;
