/*
 * Control UI on intro page.
 */

import * as apiUtils from './api_utils.js';


/** Tries to validate API keys and open editor. */
document.querySelector('#submit-apikeys').onclick = async () => {
  let perspectiveKeyHashParam = '';
  // Validate Perspective API key.
  const perspectiveKey = document.querySelector('#perspectivekey').value;
  if (perspectiveKey) {
    const isPerspectiveKeyValid =
        await apiUtils.validatePerspectiveKey(perspectiveKey);
    if (isPerspectiveKeyValid) {
      perspectiveKeyHashParam = `&${perspectiveKey}`;
    } else {
      document.querySelector('#invalid-perspective').style.display = 'block';
      return;
    }
  }

  // Validate OpenAI key.
  const apiKey = document.querySelector('#apikey').value;
  if (!apiKey) return;
  const isGpt3KeyValid = await apiUtils.validateGpt3Key(apiKey);
  if (isGpt3KeyValid) {
    location.href = `editor.html#${apiKey}${perspectiveKeyHashParam}`;
  } else {
    document.querySelector('#invalid-key').style.display = 'block';
  }
};
