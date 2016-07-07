'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

const pageContent = `
<p class="paragraph-primary">We love data and we love empowering our clients even more.  We work with you to surface data
so that you and your organization can make data-driven decisions. We routinely integrate data from multiple sources and
seemingly incompatible systems, transforming raw data to produce meaningful and actionable information. Our purpose is
to improve the quality and quantity of information available at your fingertips.</p>

#### What we are good at.
 
We're people-oriented and data savvy. We are quick to understand your business and the information that matters most.
When it comes to technology, we’re good at choosing leading edge winners that deliver high value and low cost for our clients.
Microsoft Power BI is a prime example.  We were early adopters of Power BI and are the recognized experts in the region.
Business Analytics is our daily focus and our passion.
 
#### What separates us from our competitors?
 
We listen. Our experience, expertise and commitment reduce risk and ensure your project succeeds. We're highly productive,
easy to work with and competent engaging at all levels of your organization.  For us, the importance of our long-term
relationships are paramount and your success is our first measure of success. We won't let you fail.

#### Thoughts, questions, comments.

We'd like to get to know you and a little more of your unique situation. Let's see if a fit exists. Reach out <a data-open="contactModal">here</a>
or give us a quick call at 503-292-0859.
`;

const powerBISamples = [
    {
        title: 'World Data',
        description: 'This chart is fully interactive and allows users to filter and compare data by country.',
        previewImageUrl: '/resources/images/powerbi/world-economy.png',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiZWIzNDQ2ZDctZjRmNi00NzlkLTgxNjEtODM2Nzk5ODgyMjU2IiwidCI6IjBhY2U5YjBiLWVmYWUtNDMwNC04MTBhLTE0MTdiYmQxZDBkNiIsImMiOjZ9' 
    },
    {
        title: 'Power BI Color Schemes',
        description: 'Choosing the right color scheme for your Power BI chart is difficult. We want to make it easier.',
        previewImageUrl: '/resources/images/powerbi/color-schemes.png',
        url: 'https://app.powerbi.com/view?r=eyJrIjoiYTA5MTQwYTgtMmE0ZC00NGExLWE2ZmEtYjZhNjhhMDE5OTM4IiwidCI6IjBhY2U5YjBiLWVmYWUtNDMwNC04MTBhLTE0MTdiYmQxZDBkNiIsImMiOjZ9',
        downloadFile: 'csg-pro-power-bi-color-schemes.xlsx'
    }
];

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    getPostsByTopic(['business-analytics']).then(posts => {
        reply.view(pageView('business-analytics'), {
            title: 'Business Analytics',
            description: '',
            pageContent,
            posts,
            powerBISamples
        },
        { layout: 'hero-layout' });
    });
}