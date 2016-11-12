export function slugify(str: string) {
    return str
        .trim()
        .toLowerCase()
        .replace(/[^\w-\\\/\s+]+/gi, '')
        .replace(/[\\\/\s]+/gi, '-')
        .replace(/-+/gi, '-');
}