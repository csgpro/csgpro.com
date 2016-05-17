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

export function pageHeader(image: 'lights' | 'marina') {
    let imagesPath = __dirname + '/../public/images/site';
    let imagesUrlPath = '/resources/images/site';
    let base = 'header';
    let img = `${base}-${image}`;
    let sizes = ['small', 'medium', 'large'];
    let responsiveParts = [];
    sizes.forEach(size => {
        if (fs.existsSync(`${imagesPath}/${img}-${size}.jpg`)) {
            responsiveParts.push({ size, path: `${imagesUrlPath}/${img}-${size}.jpg` });
        }
    });
    
    if (!responsiveParts.length) return;
    
    let images = responsiveParts.map(image => {
        return `[${image.path}, ${image.size}]`;
    });
    
    return `<img data-interchange="${images.join(', ')}">`;
}