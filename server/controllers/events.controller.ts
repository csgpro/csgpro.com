// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, config, Controller } from 'hapi-decorators';

// app
import { getPost, getPostsByCategory, getTopics } from '../commands/post.commands';

@controller('/events')
class EventsController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/{page?}')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        
        let promises: Promise<any>[] = [];
        let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
        let limit = 10;
        let offset = page <= 1 ? 0 : (page * limit) - limit;
        
        getPostsByCategory('news', true, undefined, offset, limit).then(posts => {
            reply.view('category', { title: 'Events', description: '', posts, pagination: { basePath: '/events', pageCount: Math.ceil(posts['count'] / limit), page } });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/{year}/{month}/{slug}')
    read(request: hapi.Request, reply: hapi.IReply) {
        let postSlug: string = request.params['slug'];
        getPost(postSlug, 'news').then(news => {
            if (!news) {
                reply(boom.notFound());
            }
            let newsJSON = news.toJSON();
            reply.view('post', { title: newsJSON.title, post: newsJSON }, { layout: 'hero-layout' });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }
}

export default new EventsController();