// libs
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..', '..', '..');

function hero(input: string): string {
    let rootUrl = '/resources/images/site';
    let img = `header-${input}`;
    let sizes = ['small', 'medium', 'large'];
    let responsiveParts = [];
    sizes.forEach(size => {
        let imagePath = resolve(root, 'public', 'images', 'site', `${img}-${size}.jpg`);
        if (existsSync(imagePath)) {
            responsiveParts.push({ size, path: `${rootUrl}/${img}-${size}.jpg` });
        }
    });
    
    if (responsiveParts.length === 0) return;

    let images = responsiveParts.map(image => {
        return `[${image.path}, ${image.size}]`;
    });
    
    return `<img data-interchange="${images.join(', ')}">`;
}

export = hero;