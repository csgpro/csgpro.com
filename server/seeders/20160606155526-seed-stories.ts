'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';
import { Story } from '../models/story.model';

const storyOneBody = `Schnitzer Steel is a global leader in the metals recycling industry that has grown from a single person operation in 1906 to a Fortune 1000 company today.

Schnitzer tapped CSG to architect and develop their four public websites back in 2007. When it came time to freshen up Schnitzer's main website, Schnitzer asked CSG to implement their new designs. CSG took things a step further by using a "responsive design" approach that ensures the site works well on desktops, laptops, tablets and smartphones.

[Read Full Case Study](http://csgpro.com/post/110086)`;

const storyTwoBody = `Oregon Beverage Recycling Cooperative (OBRC) processes virtually 100% of recyclable containers redeemed throughout Oregon. Know Your Nickel, a campaign by OBRC and their branding agency, was created to educate the public on the impact of recycling.

CSG expanded the campaign message through web and mobile by creating a development strategy that included: cloud hosting, mobile design, responsive development, and localization. CSG used HTML5, CSS3 and Windows Azure was selected as the hosting platform.

The flexibility of Azure’s cloud hosting ensured website availability regardless of high usage spikes. Featured on NPR, Oregon Live and billboards across the Portland Metro area, the web campaign launched successfully and continues to deliver this important message.`;

const storyThreeBody = `Oregon International Air Freight (OIA) is a leading third-party logistics provider that offers freight forwarding, warehousing, distribution, customs brokering, global sourcing, and creative packaging solutions.

As a leader in logistics, OIA sought creative ways to efficiently utilize all software and database systems that were helping them lead the industry yet required considerable amounts of manual effort to maintain. CSG tasks included: requirements analysis, backend data modeling, new SharePoint lists, and new ETL processes.

CSG built a highly functional, time-saving, and user-friendly dashboard that leveraged Microsoft SQL Server, Excel, PowerPivot, SQL Server Integration Services (SSIS), and SharePoint. It delivered essential information required for managing the logistics and packaging divisions.`;

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return Story.sync()
            .then(() => {
                Story.bulkCreate([
                    {
                        id: 8,
                        title: 'Updating & Enancing: SchnitzerSteel.com Redesign',
                        body: storyOneBody,
                        downloadUrl: null,
                        slug: 'updating-and-enhancing-schnitzersteel-com-redesign',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/schnitzer-steel-story.png'
                    },
                    {
                        id: 9,
                        title: 'Increase Awareness: OBRC - Know Your Nickel',
                        body: storyTwoBody,
                        downloadUrl: null,
                        slug: 'increase-awareness-obrc-know-your-nickel',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/obrc-story.png'
                    },
                    {
                        id: 10,
                        title: 'OIA Packaging Financial Dashboard',
                        body: storyThreeBody,
                        downloadUrl: null,
                        slug: 'oia-packaging-financial-dashboard',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/oia-story.png'
                    }
                ]);
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};