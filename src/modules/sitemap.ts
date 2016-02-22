'use strict';

import * as _ from 'lodash';

interface IPage {
    path: string;
    title: string;
}

let pages: IPage[] = [];

export function addPage(path: string, title: string) {
    if (_.find(pages, { path })) {
        throw new Error(`route already in sitemap: ${path}`);
    }
    pages.push({ path, title });
}

export function getPages() {
    return _.orderBy(pages, 'path', 'asc');
}