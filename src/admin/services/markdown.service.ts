// angular
import {Injectable} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser';

// libs
import * as marked from 'marked';
const hljs = require('highlight.js');

const options = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-',
    renderer: new marked.Renderer()
};

options.renderer.code = function highlightFn(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(language, code).value : code;
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions(options);

@Injectable()
export class MarkdownService {
    constructor(private _domSanitization: DomSanitizationService) {}
    render(input: string) {
        if (!input) return;
        return this._domSanitization.bypassSecurityTrustHtml(marked(input));
    }
}

