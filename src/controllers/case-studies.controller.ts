'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

caseStudies.title = 'Case Studies';
export function caseStudies(request: hapi.Request, reply: hapi.IReply) {
    reply.view('case-studies', { title: caseStudies.title, description: '' });
}