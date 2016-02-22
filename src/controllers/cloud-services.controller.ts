'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

export let prefix = '/services';

cloudServices.title = 'Cloud Services'
export function cloudServices(request: hapi.Request, reply: hapi.IReply) {
    reply.view('cloud-services', { title: cloudServices.title, description: '' });
}