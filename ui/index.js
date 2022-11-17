/*
 * Control UI on intro page.
 */

import * as apiUtils from './api_utils.js';


/** Tries to validate API key and open editor. */
document.querySelector('#submit-apikey').onclick = async () => {
  const apiKey = document.querySelector('#apikey');
  if (!apiKey) return;
  const isValid = await apiUtils.validateKey(apiKey);
  if (isValid) {
    location.href = `editor.html#${apiKey}`;
  } else {
    document.querySelector('#invalid-message').style.display = 'block';
  }
};
