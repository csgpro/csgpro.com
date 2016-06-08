'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

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