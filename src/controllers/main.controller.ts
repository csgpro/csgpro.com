'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view('home', { title: 'Home', description: '', address: 'CSG Pro<br>Portland, Oregon' }, { layout: 'hero-layout' });
}