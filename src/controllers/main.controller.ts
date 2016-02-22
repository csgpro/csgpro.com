'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

main.title = 'Home';
export function main(request: hapi.Request, reply: hapi.IReply) {
    reply.view('main', { title: main.title, description: '', address: 'CSG Pro<br>Portland, Oregon' });
}