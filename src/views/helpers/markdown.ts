'use strict';

import * as marked from 'marked';
let hljs = require('highlight.js');

let Renderer = marked.Renderer;

// Create your custom renderer.
const renderer = new Renderer();
renderer.code = (code, language) => {
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && hljs.getLanguage(language));
    language = validLang ? language : 'html'; // Default to html
    // Highlight only if the language is valid.
    const highlighted = hljs.highlight(language, code).value;
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

function markdown(input: string): string {
    if (!input) return;
    return marked(input);  
}

export = markdown;