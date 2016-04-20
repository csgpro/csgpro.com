'use strict';

import * as _ from 'lodash';

interface IPage {
    path: string;
    title: string;
    nested: boolean;
}

let pages: IPage[] = [];

export function addPage(path: string, title: string, nested: boolean) {
    if (_.find(pages, { path })) {
        throw new Error(`route already in sitemap: ${path}`);
    }
    pages.push({ path, title: prepareTitle(title), nested });
}

export function getPages() {
    return _.orderBy(pages, 'path', 'asc');
}

function prepareTitle(title: string) {
    title = title.replace(/-/g, ' ');
    return title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}