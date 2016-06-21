'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

const pageContent = `
<p class="paragraph-primary">At CSG, our Application Development Team combines Microsoft and Open Source technologies to create Custom Software Solutions.   Our clients realize a strategic, competitive advantage because their complex or unique business requirements can’t be solved easily with out-of-the-box solutions.   We build these solutions using the latest JavaScript frameworks combined with Microsoft ASP.NET to develop modern applications that are accessible at any time, from any device.</p>

#### What we are good at.

We're passionate about designing and building custom software solutions – web, mobile and line of business - that improve business processes with accurate and streamlined data collection, improve relationships with internal and external customers and by making your employees more productive.

Already have a development team? We’re happy to work together, combining members of our Application Development Team with yours. Whether they are highly skilled and just resource constrained, or whether they receive mentoring from CSG on the latest technologies, we’ve found blended teams an enormously successful way to develop complex, mission-critical applications.

#### What separates us from our competitors?

Our people listen.   We're experts in Software Development Lifecycle and Agile Development, placing a high importance on collaboration between the client and the project team.   Our clients find the results compelling – we provide transparency, predictable costs and schedule, focus on end users and business value, and improved quality.    Our commitment is delighting you.
`;

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    getPostsByTopic(['angularjs', 'application-development']).then((posts) => {
        reply.view(pageView('custom-software'), {
            title: 'Custom Software',
            description: '',
            pageContent,
            posts
        },
        { layout: 'hero-layout'});
    }).catch((err: Error) => {
        if (err.name === 'SequelizeConnectionError') {
            reply(boom.create(503, 'Bad Connection'));
        } else {
            reply(boom.create(503, err.message));
        }
    });
}