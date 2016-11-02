export function slugify(str: string) {
    return str.trim().replace(/[^a-z0-9]+/gi, ' ').trim().replace(' ', '-').toLowerCase();
}