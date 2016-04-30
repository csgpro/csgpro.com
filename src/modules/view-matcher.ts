'use strict';

import * as fs from 'fs';
import * as path from 'path';

export function pageView(page: string) {
    let viewsPath = __dirname + '/../views';
    let base = 'page';
    let template = `${base}-${page}`;
    if (fs.existsSync(`${viewsPath}/${template}.html`)) {
        return template;
    }
    return base;
}