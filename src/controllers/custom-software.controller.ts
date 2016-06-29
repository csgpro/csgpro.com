'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

const pageContent = `
<p class="paragraph-primary">At CSG, our team combines Microsoft and Open Source technologies to create custom software solutions. People first decide to build a custom solution rather than buy because they have a strategic business need that when addressed through custom software adds competitive advantage or key cost reduction.  Often it adds an essential ingredient to the success of that business.   They build it to fit because they cannot buy it to fit complex or unique business requirements with out-of-the-box solutions.  CSG solutions are accessible at any time, from any device to support people on the go.</p>

#### What we are good at.

We're passionate about designing and building custom software solutions – web, mobile and line of business - that improve business processes with accurate and streamlined data collection, improve relationships with internal and external customers and by making your employees more productive.

Already have a development team? We're happy to work together, combining highly productive members of our Custom Solutions Team with yours.  Whether they are highly skilled, just resource constrained, or whether they receive mentoring from CSG on the latest technologies, we've found blended teams an enormously successful way to develop complex, business-critical applications.

#### What separates us from our competitors?

Our people listen. We're experts in Software Development Lifecycle and Agile Development, placing a high importance on collaboration between the client and the project team.   

Our clients find the results compelling - we provide transparency, predictable costs and schedule, focus on end users and business value, and improved quality. Our commitment is delighting you.

#### Thoughts, questions, comments.

We'd like to get to know you and a little more of your unique situation.   Let's see if a fit exists.   Reach out <a data-open="contactModal">here</a> or give us a quick call at 503-292-0859.
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