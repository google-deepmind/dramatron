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
 * Control UI on intro page.
 */

import * as apiUtils from './api_utils.js';


/** Tries to validate API keys and open editor. */
document.querySelector('#submit-apikeys').onclick = async () => {
  for (const elem of document.querySelectorAll('.invalid-message')) {
    elem.style.display = 'none';
  }
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
  const gpt3KeyStatus = await apiUtils.validateGpt3Key(apiKey);
  if (gpt3KeyStatus == apiUtils.REQUEST_OK) {
    location.href = `editor.html#${apiKey}${perspectiveKeyHashParam}`;
  }  else if (gpt3KeyStatus == apiUtils.QUOTA_ERROR) {
    document.querySelector('#quota-error').style.display = 'block';
  } else if (gpt3KeyStatus == apiUtils.CREDENTIALS_ERROR) {
    document.querySelector('#invalid-key').style.display = 'block';
  } else if (gpt3KeyStatus == apiUtils.TIMEOUT_ERROR) {
    document.querySelector('#timeout').style.display = 'block';
  }
};
