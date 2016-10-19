// libs
import { existsSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..', '..');

export function pageView(page: string): string {
    let template = 'page';
    let templatePath = join(root, 'server', 'views', `${template}-${page}.html`);
    if (existsSync(templatePath)) {
        template = `${template}-${page}`;
    }
    return template;
}