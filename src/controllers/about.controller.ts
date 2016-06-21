'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';

const pageContent = `
<p class="paragraph-primary">CSG Pro builds modern software solutions that expand knowledge through a more informed and visual use of data.    Through Business Analytics and Custom Software Solutions, CSG Pro delivers value by helping clients intelligently bring together, analyze and visualize data to make informed decisions and streamline their business processes.  We integrate cloud and mobile as appropriate to allow for scale, enhance the user’s experience and ensure long-term payoff.</p>
 
Headquartered in Portland Oregon’s urban, tech savvy Pearl District, CSG Pro is committed to delighting its clients through the innovative application of modern technology solutions.   We hope to have the opportunity to build something amazing for you today, as we have for many since 1993.
`;

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view(pageView('about'),
    {
        title: 'About CSG Pro',
        description: '',
        header: pageHeader('portland'),
        pageContent
    },
    { layout: 'hero-layout' });
}