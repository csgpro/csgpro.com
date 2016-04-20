'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

export let prefix = '/services';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view('cloud-services', { title: 'Cloud Services', description: '' });
}