'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

export function main(request: hapi.Request, reply: hapi.IReply) {
    reply.view('main', { title: 'Home', description: '', address: 'CSG Pro<br>Portland, Oregon' });
}