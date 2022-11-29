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

const END_MARKER = '<end>\n\n';
const STOP_MARKER = '<stop>';

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
Example 1. In the following story, Bob has an argument with his best friend, Charles.
${CHARACTER_MARKER}Bob ${
    DESCRIPTION_MARKER}Bob is mid forties, corpulent. He is pompous and self-absorbed. Bob is married to Alice.${
    STOP_MARKER}
${CHARACTER_MARKER}Alice ${
    DESCRIPTION_MARKER}Bob's wife Alice is thirty something, serious and bookish.${
    STOP_MARKER}
${CHARACTER_MARKER}Charles ${
    DESCRIPTION_MARKER}Charles is forty something and athletic. Charles and Bob are best friends.${
    STOP_MARKER}
${END_MARKER}
Example 2. In the following story, Terence tries and fails to become a wizard.
${CHARACTER_MARKER}Terence ${
    DESCRIPTION_MARKER}Terence is twenty one, small, dark. He is eager to learn, and ambitious. Terence is the student of Pompulus.${
    STOP_MARKER}
${CHARACTER_MARKER}Pompulus the Wizard ${
    DESCRIPTION_MARKER}Pompulus the Wizard is ancient, white haired, emaciated. He is pompous and expansive. Pompulus instructs Terence in wizardry.${
    STOP_MARKER}
${CHARACTER_MARKER}Brenda ${
    DESCRIPTION_MARKER}Brenda is the mother of Terence. She is intelligent and caring.${
    STOP_MARKER}
${END_MARKER}
Example 3. In the following story, Jerry falls in love with Lydia.
${CHARACTER_MARKER}Jerry ${
    DESCRIPTION_MARKER}Jerry is in his 30s, sallow, a bit puffy. His hair is a little messy, his suit is either vintage or just old and dirty and sort of threadbare. His bright tie has a photograph of a rodeo printed on it. Jerry lives on the same block as Lydia.${
    STOP_MARKER}
${CHARACTER_MARKER}Lydia ${
    DESCRIPTION_MARKER}Lydia is wearing a fluorescent orange hooded sweatshirt. She's in her early thirties. Lydia is Jerry's neighbor.${
    STOP_MARKER}
${END_MARKER}
Example 4. In the following story, `;

export const SCENE_PROMPT = `
Example 1. In the following story, Bob has an argument with his best friend, Charles.
Bob is mid forties, corpulent. He is pompous and self-absorbed. Bob is married to Alice.
Bob's wife Alice is thirty something, serious and bookish.
Charles is forty something and athletic. Charles and Bob are best friends.

${SCENES_MARKER}

${PLACE_ELEMENT}The pub.
${PLOT_ELEMENT}Beginning.
${BEAT_ELEMENT}Alice, Bob, and Charles are sitting at a table in the corner and make a number of jokes, but Alice laughs loudest at Charles' jokes. Bob gets grumpy that Alice is paying Charles more attention.

${PLACE_ELEMENT}The office.
${PLOT_ELEMENT}Middle.
${BEAT_ELEMENT}Charles, sitting at his desk, mocks Bob for various perceived flaws. Charles insults Bob once too often, and Bob is visibly offended.

${PLACE_ELEMENT}Charles' flat.
${PLOT_ELEMENT}Conclusion.
${BEAT_ELEMENT}Charles tries to apologise, but Bob is unmoved. Bob tells Charles he has gone too far this time, and storms out.

${END_MARKER}

Example 2. In the following story, Terence tries and fails to become a wizard. The main characters are Terence, Pompulus (a wizard), and Brenda (Terence’s mother).
Terence is twenty one, small, dark. He is eager to learn, and ambitious. Terence is the student of Pompulus.
Pompulus the Wizard is ancient, white haired, emaciated. He is pompous and expansive. Pompulus instructs Terence in wizardry.
Brenda is the mother of Terence. She is intelligent and caring.

${SCENES_MARKER}

${PLACE_ELEMENT}Pompulus the Wizard's tower.
${PLOT_ELEMENT}Beginning.
${BEAT_ELEMENT}Pompulus asks Terence to do a number of tedious tasks, and Terence reluctantly performs them. Terence asks Pompulus if he can become a wizard one day; Pompulus says Terence needs to take the wizard's test.

${PLACE_ELEMENT}Pompulus the Wizard's examination halls.
${PLOT_ELEMENT}Middle.
${BEAT_ELEMENT}Terence is writing furiously at his desk and expresses frustration that the questions are so difficult, but Pompulus is not sympathetic. Pompulus tells Terence that he has failed the test.

${PLACE_ELEMENT}Terence's house.
${PLOT_ELEMENT}Conclusion.
${BEAT_ELEMENT}Lying on his bed, Terence wishes he had studied harder, and his mother Brenda tries to reassure him. Terence vows to study harder and try again next year.

${END_MARKER}

Example 3. In the following story, `;

export const SETTING_PROMPT = `
Example 1. In the following story, Terence tries and fails to become a wizard.
${PLACE_ELEMENT}The train station.
${DESCRIPTION_ELEMENT}It's grey. The platform is packed with business commuters: suits, overcoats. There is such a lack of colour it almost seems as if it's a black and white shot. The platform across the tracks is empty.${
    END_MARKER}
Example 2. In the following story, Jerry falls in love with Lydia.
${PLACE_ELEMENT}The bar.
${DESCRIPTION_ELEMENT}The bar is dirty, more than a little run down. As we pan across several empty tables, we can almost smell the odor of last night's beer and crushed pretzels on the floor.${
    END_MARKER}
Example 3. In the following story, Bob has an argument with his best friend, Charles.
${PLACE_ELEMENT}The diner.
${DESCRIPTION_ELEMENT}It's a local tourist place, but off-season empty.${
    END_MARKER}
Example 4. `;

export const TITLES_PROMPT = `
Examples of alternative, original and descriptive titles known for play and film scripts.

Example 1. In the following story, Bob has an argument with his best friend, Charles. Title: The End of A Friend${
    END_MARKER}
Example 2. In the following story, Terence tries and fails to become a wizard. Title: Spellcaster${
    END_MARKER}
Example 3. In the following story, Tom falls in love with Daisy. Title: The Greatest Love Story Ever Told${
    END_MARKER}
Example 4. In the following story, `;

export const DIALOG_PROMPT = `
Example 1.
${PLACE_ELEMENT}The bar.
${DESCRIPTION_ELEMENT}The bar is dirty, more than a little run down. If there is ever a cook on duty, he's not here now. As we pan across several empty tables, we can almost smell the odor of last night's beer and crushed pretzels on the floor.
${CHARACTERS_ELEMENT}Jerry is in his 30s, sallow, a bit puffy. His hair is a little messy, his suit is either vintage or just old and dirty and sort of threadbare. His bright tie has a photograph of a rodeo printed on it. Jerry lives on the same block as Lydia.
Lydia is wearing a fluorescent orange hooded sweatshirt. She's in her early thirties. Lydia is Jerry's neighbor.
${PLOT_ELEMENT}Middle.
${SUMMARY_ELEMENT}Jerry falls in love with Lydia.
${PREVIOUS_ELEMENT}Lydia notices Jerry sitting at the bar and makes small talk.
${BEAT_ELEMENT}Jerry tells Lydia the story of his proposal. Jerry tells Lydia that he failed to propose.

${DIALOG_MARKER}

LYDIA
Tell me how you proposed.

JERRY
No no...

LYDIA
(impatient) Oh, just tell the story.

Pause. Jerry is thinking.

JERRY
So our first date, she told me about her favorite place in the world, the seven pools of Hana on the island of Maui...

LYDIA
Gorgeous.

JERRY
A year-and-a-half later, we were both in Hawaii for the Pro Bowl. Now I've always hit a wall at 18 months. Every serious girlfriend lasts 18 months. It's like --ka-boom. The curse of 18 months.

LYDIA
That's when you need to cement, and define define define.

JERRY
Exactly. And the world does not need another 35 year-old bachelor. I knew I wanted to propose, so I took her there.

LYDIA
To the pools?

JERRY
To the pools. Now she's Miss Rock Climber, and I'm more the Non-Rock Climber, but we're hiking up through the pools and there's a fine mist in the air, and I have the ring in my pocket, and I'm a little nervous, I'm lagging behind, and she says to me, get this -- "Hurry up, klutz."

Jerry takes a drink of his beer.

LYDIA
Oh no --

JERRY
(frowning) Well, it bothered me somewhat. And I got quiet. And now she's quiet and we're both pouting a little, you know. And I decide I'm not going to propose. The mood is not right. Why be impulsive? Now at this point I know she knows that I was going to propose and didn't. And she knows I know. So the entire sixty mile ride back to the airport, we don't speak. And we're both good at that. We fly to Honolulu in silence. We check into the Pro Bowl hotel --

LYDIA
How sad --
${END_MARKER}

Example 2.
`;
