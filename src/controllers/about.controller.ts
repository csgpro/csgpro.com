'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

about.title = 'About';
export function about(request: hapi.Request, reply: hapi.IReply) {
    reply.view('about', { title: about.title, description: '' });
}