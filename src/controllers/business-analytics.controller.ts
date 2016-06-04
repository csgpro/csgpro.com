'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';

const pageContent = `
<p class="paragraph-primary">We are specialists with data. We help you make better decisions that support your business strategy. Those decisions happen by transforming and analyzing data into actionable information. This is what we do and care about, every day. The outcome &mdash; delighted clients.</p>

#### What is CSG Pro good at?

- We're people oriented and data driven. We are quick-thinking
when it comes to understanding your business and your data.

- We specialize in solving problems using Microsoft data
technologies, and Open Source and Microsoft development
frameworks and tools.

- When it comes to technology, we're good at choosing leading
edge winners with a high value and low cost for our clients.
Microsoft Power BI is a prime example. We were early adopters and
have become Microsoft endorsed, respected experts in the region.

#### What separates CSG Pro from our competitors?

- We listen. Our experience, expertise and commitment reduce risk
and ensure your project succeeds. We're comfortable working at
all levels of an organization, and are highly productive for you with
this competence.

- We're easy to work with. We have a long term local commitment.
The importance of our relationship can’t be understated. We work
hard to earn your trust.

- Your success is our measure of success, so we won't let you fail. We
do what it takes to deliver what we promise, every time.
`;

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view(pageView('business-analytics'), {
        title: 'Business Analytics',
        description: '',
        header: pageHeader('marina'),
        pageContent
    },
    { layout: 'hero-layout' });
}