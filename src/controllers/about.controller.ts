'use strict';

import * as hapi from 'hapi';
import * as boom from 'boom';
import { pageView } from '../modules/view-matcher';

const pageContent = `Our team loves to build solutions that are beautifully designed, functional and hardworking. We integrate modern cloud and mobile technologies with on-premises systems to maximize value, create massive scale and ensure long-term supportability. CSG does whatever it takes to help organizations get the most value out of their systems. We know that every project is connected to the business. The right solution will meet business requirements, have a great user experience, complement current architecture, and anticipate future needs.

Headquartered in Portland Oregon, CSG is deeply committed to our values: Do What’s Right, Team Over Self, Deliver Excellence, and Create Value. We hope we have the opportunity to live these out while building something amazing for your business.`;

index.sitemap = true;
export function index(request: hapi.Request, reply: hapi.IReply) {
    reply.view(pageView('about'), { title: 'About CSG Pro', description: '', pageContent });
}