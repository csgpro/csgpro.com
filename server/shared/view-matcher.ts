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

export function pageHeader(image: string) {
    let rootPath = path.join(__dirname, '..', '..', 'public', 'images', 'site');
    let rootUrl = '/resources/images/site';
    let base = 'header';
    let img = `${base}-${image}`;
    let sizes = ['small', 'medium', 'large'];
    let responsiveParts = [];
    sizes.forEach(size => {
        let imagePath = path.join(rootPath, `${img}-${size}.jpg`);
        if (fs.existsSync(imagePath)) {
            responsiveParts.push({ size, path: `${rootUrl}/${img}-${size}.jpg` });
        }
    });
    
    if (!responsiveParts.length) {
        console.log(`Header Not Found: ${image}`);
        return;
    }
    
    let images = responsiveParts.map(image => {
        return `[${image.path}, ${image.size}]`;
    });
    
    return `<img data-interchange="${images.join(', ')}">`;
}