'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { getPages } from '../modules/sitemap';

export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view('sitemap', { title: 'Sitemap', description: '', pages: getPages() });
}