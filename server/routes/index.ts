// libs
import {Server} from 'hapi';
import * as path from 'path';
import * as fs from 'fs';

// app
import PublicController from '../controllers/public.controller';
import MainController from '../controllers/main.controller';
import AboutController from '../controllers/about.controller';
import BlogController from '../controllers/blog.controller';
import BusinessAnalyticsController from '../controllers/business-analytics.controller';
import CareersController from '../controllers/careers.controller';
import ContactController from '../controllers/contact.controller';
import CustomSoftwareController from '../controllers/custom-software.controller';
import DownloadController from '../controllers/download.controller';
import EventsController from '../controllers/events.controller';
import FileController from '../controllers/file.controller';
import SitemapController from '../controllers/sitemap.controller';
import StoriesController from '../controllers/stories.controller';
import TopicController from '../controllers/topic.controller';
import DataWarehousingController from '../controllers/data-warehousing.controller';
import TrainingController from '../controllers/training.controller';

// api
import ApiAuthenticateController from '../controllers/api/authenticate.controller';
import ApiCategoryController from '../controllers/api/category.controller';
import ApiContactController from '../controllers/api/contact.controller';
import ApiFileController from '../controllers/api/file.controller';
import ApiPostController from '../controllers/api/post.controller';
import ApiStoryController from '../controllers/api/story.controller';
import ApiTopicController from '../controllers/api/topic.controller';
import ApiUserController from '../controllers/api/user.controller';
import ApiWebhookController from '../controllers/api/webhook.controller';

export const register: any = function register(server: Server, options, next) {
    server.route({
        method: 'GET',
        path: '/resources/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                listing: true
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/admin/resources/{param*}',
        handler: {
            directory: {
                path: './admin',
                redirectToSlash: true,
                listing: true
            }
        }
    });
    server.route(PublicController.routes());
    server.route(MainController.routes());
    server.route(AboutController.routes());
    server.route(BlogController.routes());
    server.route(BusinessAnalyticsController.routes());
    server.route(CareersController.routes());
    server.route(ContactController.routes());
    server.route(CustomSoftwareController.routes());
    server.route(DownloadController.routes());
    server.route(EventsController.routes());
    server.route(FileController.routes());
    server.route(SitemapController.routes());
    server.route(StoriesController.routes());
    server.route(TopicController.routes());
    server.route(DataWarehousingController.routes());
    server.route(TrainingController.routes());

    // api
    server.route(ApiAuthenticateController.routes());
    server.route(ApiCategoryController.routes());
    server.route(ApiContactController.routes());
    server.route(ApiFileController.routes());
    server.route(ApiPostController.routes());
    server.route(ApiStoryController.routes());
    server.route(ApiTopicController.routes());
    server.route(ApiUserController.routes());
    server.route(ApiWebhookController.routes());

    next();
};


register.attributes = {
    name: 'Routes',
    version: '1.0.0'
};
