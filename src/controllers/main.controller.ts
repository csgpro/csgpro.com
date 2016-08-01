'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view('home', { title: 'Custom Software, Business Analytics, and Cloud Services', description: `Headquartered in Portland Oregon's urban, tech savvy Pearl District, CSG Pro is committed to delighting its clients through the innovative application of modern technology solutions. We hope to have the opportunity to build something amazing for you today, as we have for many since 1993.` }, { layout: 'hero-layout' });
}