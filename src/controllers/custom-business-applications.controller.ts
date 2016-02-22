'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

export let prefix = '/services';

customBusinessApplications.title = 'Custom Business Applications';
export function customBusinessApplications(request: hapi.Request, reply: hapi.IReply) {
    reply.view('custom-business-applications', { title: customBusinessApplications.title, description: '' });
}