'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView, pageHeader } from '../modules/view-matcher';
import { getPostsByTopic } from '../commands/post.commands';

const pageContent = `
<p class="paragraph-primary">CSG is a successful business analytics company and specialists with data.</p>
 
<p class="paragraph-primary">We give decision-makers and other stakeholders access to data to make better decisions that support your business strategy.   Many times we reveal previously unavailable, unknown, and untapped information on, for example, customers, trends, and demands.  How?   We integrate data from multiple incompatible systems into a form that provides a single, consistent, subject-oriented view of the organization, transforming and analyzing this data into meaningful, actionable  information.</p>

#### What we are good at.
 
We're people-oriented and data-driven. We are quick thinking when it comes to understanding your business and your data.  When it comes to technology, we're good at choosing leading edge winners with a high value and low cost for our clients.  Microsoft Power BI is a prime example.  We were early adopters and have become Microsoft endorsed, respected experts in the region.   This is what we do and care about, every day.
 
#### What separates us from our competitors?
 
We listen. Our experience, expertise and commitment reduce risk and ensure your project succeeds. We’re comfortable working at all levels of an organization, and are highly productive for you with this competence. We're easy to work with.  We have a long term local commitment. The importance of our relationships can't be understated.  Your success is our measure of success, so we won't let you fail.  The result – delighted clients.
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