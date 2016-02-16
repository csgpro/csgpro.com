'use strict';

import * as marked from 'marked';
var hljs = require('highlight.js');

var Renderer = marked.Renderer;

// Create your custom renderer.
const renderer = new Renderer();
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && hljs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? hljs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-',
    renderer
});

function formatDate(input: string): string {
    return marked(input);  
}

export = formatDate;