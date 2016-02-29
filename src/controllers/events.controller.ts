'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

events.title = 'Events';
export function events(request: hapi.Request, reply: hapi.IReply) {
    reply.view('events', { title: events.title, description: '' });
}