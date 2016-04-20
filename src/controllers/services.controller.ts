'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view('services', { title: 'Services', description: '' });
}