'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

const pageContent = `
<p class="paragraph-primary">At CSG, our team combines Microsoft and Open Source technologies to create custom software solutions.
Our clients find strategic benefits and a competitive advantage from our custom solutions that out-of-the-box solutions don't offer.
Often a custom software solution adds an essential ingredient to the success of their business and reduces total cost of ownership.
Utilizing the latest technologies, CSG solutions are accessible at any time, from any device, to support people on the go.</p>

#### What we are good at.

We're passionate about designing and building custom software solutions &mdash; web, mobile and line of business - that improve business
processes with accurate and efficient data collection, improve relationships with internal and external customers and make your employees
more productive.

Already have a development team? We're happy to work together, combining highly productive members of our Custom SolutionsTeam with yours.
Whether your team is highly skilled and resource constrained, or they receive mentoring from CSG on the latest technologies,
we've found blended teams an enormously successful way to develop complex, business-critical applications.

#### What separates us from our competitors?

Our people listen. We're experts in Software Development Lifecycle and Agile Development, placing a high importance on collaboration
between the client and the project team.

Our clients find the results compelling &mdash; we provide transparency, predictable costs and schedule, focus on end users and
business value, and improved quality. Our commitment is delighting you.

CSG's Custom Solutions Team is an active Microsoft Gold Application Development Partner.


#### Thoughts, questions, comments.

We'd like to get to know you and a little more of your unique situation. Let's see if a fit exists. Reach out <a data-open="contactModal">here</a>
or give us a quick call at 503-292-0859.
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