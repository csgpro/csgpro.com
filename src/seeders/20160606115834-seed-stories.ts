'use strict';

import * as Sequelize from 'sequelize';
import { database, sqlAttribute } from '../database';
import { Story } from '../models/story.model';

const storyOneBody = `A large, healthcare provider, based in the northwest, wanted to centralize the management and distribution of its internal reporting capabilities and catalog. The goal was to create a central dashboard of all defined reports found across the spectrum of their internal applications and databases.

The application created by CSG Pro provided a means for appropriately privileged users to review, create, edit reports across the organization’s environments.  The application was developed with Microsoft Visual Studio using MVC, Typescript, Knockout, Entity Framework and Windows authentication security on IIS.

CSG Pro provided requirements analysis, development, quality assurance and deployment.  The result is a secure, web-based, user-friendly application built on IIS and SQL platforms.  The application provides multiple query mechanisms with robust search and filter capabilities, as well as list favorites, templates and sort options; all controlled through a variety of user privileges and access.`;

const storyTwoBody = `A major agriculture company based in the northwest was in need of an application to track their products through the growth and shipping lifecycle.  

The application created by CSG Pro provided a means for appropriately privileged users to generate records of planting, harvesting, storing, shipping, receiving and inventory across the suite of the client’s products.  The application was developed with Microsoft Visual Studio using WebAPI, Typescript, Angular, Entity Framework and ADFS security in Azure.

CSG Pro provided requirements analysis, development, quality assurance and ultimately deployment and ongoing support.  The result is a secure, web-based, user-friendly application built on Microsoft Azure Web and SQL platforms.  The application provides a variety of user privileges and access, as well as audit trails and archiving of records; maintaining referential integrity between records throughout the lifecycle.  The application is currently used in a production capacity across North America.`;

const storyThreeBody = `A state department needed an older application updated to be more responsive and reduce maintenance times for application updates.  Current processes can take weeks or even months for simple changes and administrative updates to the application.

CSG is in the process of updating the application so that application updates are instantaneous and do not require deployment of code using an internal review process.  The new process allows them to continue consolidate data from various database sources and Microsoft Excel spreadsheets and upload them to the new system.

The reduction in data load times from weeks to seconds will greatly improve the system usability.  Further enhancements to allow the creation a new program years and text updates using application will further improve system quality while reducing the number of deployments.  The end result will improve the usability and reduce the total cost of ownership for the application.`;

const storyFourBody = `A large insurance company requested an update to an existing web forms application to improve adoption and increase features using the latest web technologies.

The application created by CSG Pro used MVC, Typescript and Entity Framework and was deployed to an on premise IIS instance that was exposed to the public via the internet.  The application requires access to internal nonpublic databases and sits in the company DMZ zone.`;

const storyFiveBody = `An industry leader in the used auto parts industry requested an update to their website.  They had a need to use current technologies to create a responsive designed that allowed mobile to desktop access.  This company used shared libraries with a parent site, a custom search engine and required a site upgrade to support multiple languages.

CSG Pro provided an application which transitioned seamlessly from English to Spanish and from desktop to mobile across multiple browsers with the appropriate look and feel for each.  Based on the results the client is requested additional work to bring in additional features to the site to make it more useful to its users.`;

const storySixBody = `Companies have requested CSG developers for short term replacements to both mentor existing staff and fill in for missing staff developers.  CSG developers have a wide skill set and can quickly fill in to ensure projects continue when you don’t have the internal staff needed.`;

const storySevenBody = `CSG has assisted local companies with moving their existing application from on premise or virtual cloud machines to Azure using Azure Web Services and Azure SQL Databases.  This process eliminates the need for maintaining physical or virtual servers on premise or in the cloud by selecting just the services needed in Azure.  This reduces costs and maintenance time for applications as you pay for only what you need and patches and backups are part of the service.`;

export = {
    up: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes): any => {
        return Story.sync()
            .then(() => {
                Story.bulkCreate([
                    {
                        id: 1,
                        title: 'Custom Application Development for Healthcare',
                        body: storyOneBody,
                        downloadUrl: null,
                        slug: 'custom-application-development-for-healthcare',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/custom-application-development-for-healthcare.png'
                    },
                    {
                        id: 2,
                        title: 'Custom Application Development and Support for Agriculture Management',
                        body: storyTwoBody,
                        downloadUrl: null,
                        slug: 'custom-application-development-and-support-for-agriculture-management',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/custom-application-development-and-support-for-agriculture-management.png'
                    },
                    {
                        id: 3,
                        title: 'Improving Processes through Custom Application Development',
                        body: storyThreeBody,
                        downloadUrl: null,
                        slug: 'improving-processes-through-custom-application-development',
                        isActive: true,
                        inSlider: true,
                        sliderImageUrl: '/resources/images/stories/improving-processes-through-custom-application-development.png'
                    },
                    {
                        id: 4,
                        title: 'Custom Application Development for the Insurance Industry',
                        body: storyFourBody,
                        downloadUrl: null,
                        slug: 'custom-application-development-for-insurance-industry',
                        isActive: true,
                        inSlider: false,
                        sliderImageUrl: null
                    },
                    {
                        id: 5,
                        title: 'Automotive Industry Custom Application Development',
                        body: storyFiveBody,
                        downloadUrl: null,
                        slug: 'automotive-industry-custom-application-development',
                        isActive: true,
                        inSlider: false,
                        sliderImageUrl: null
                    },
                    {
                        id: 6,
                        title: 'Short Term Web Development Staffing and Mentoring',
                        body: storySixBody,
                        downloadUrl: null,
                        slug: 'short-term-web-development-staffing-and-mentoring',
                        isActive: true,
                        inSlider: false,
                        sliderImageUrl: null
                    },
                    {
                        id: 7,
                        title: 'Moving applications to Azure',
                        body: storySevenBody,
                        downloadUrl: null,
                        slug: 'moving-applications-to-azure',
                        isActive: true,
                        inSlider: false,
                        sliderImageUrl: null
                    },
                ]);
            });
    },
    down: (queryInterface: Sequelize.QueryInterface, DataTypes: Sequelize.DataTypes) => {
        // Restore backup.
    }
};