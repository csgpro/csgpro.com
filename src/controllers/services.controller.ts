'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

services.title = 'Services';
export function services(request: hapi.Request, reply: hapi.IReply) {
    reply.view('services', { title: services.title, description: '' });
}