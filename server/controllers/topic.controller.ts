// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, Controller } from 'hapi-decorators';

// app
import { getTopic, getTopics, getPostsByTopic } from '../commands/post.commands';

@controller('/topic')
class TopicController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/')
    index(request: hapi.Request, reply: hapi.IReply) {
        reply.redirect('/blog');
    }

    @get('/{topic}/{page?}')
    async topic(request: hapi.Request, reply: hapi.IReply) {
        let topicSlug: string = request.params['topic'];
        let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
        let limit = 10;
        let offset = page <= 1 ? 0 : (page * limit) - limit;

        try {
            let topics = await getTopics();
            let topic = await getTopic(topicSlug);
            let posts = await getPostsByTopic(topicSlug, true, 'DESC', offset, limit);
            let totalPosts = posts['count'];
            reply.view('category', {
                title: topic.getDataValue('topic'),
                description: '',
                posts,
                topics,
                pagination: {
                    basePath: `/topic/${topicSlug}`,
                    pageCount: Math.ceil(totalPosts / limit),
                    page
                }
            });
        } catch (err) {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        }
    }

    @get('/{topic}/feed/rss')
    async rssTopic(request: hapi.Request, reply: hapi.IReply) {
        let topicSlug: string = request.params['topic'];
        let host = request.headers['host'];
        let permalink = `/topic/${topicSlug}/feed/rss`;

        try {
            let topic = await getTopic(topicSlug);
            let posts = await topic.getPosts({ where: { 'publishedAt': { $ne: null } } });
            let title = `CSG Pro ${topic.getDataValue('topic')} Posts`;
            let description = `Lastest posts about "${topic.getDataValue('topic')}"`;
            reply.view('rss', { posts, host, title, description, permalink }, { layout: 'blank' }).type('text/xml');
        } catch (err) {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        }
    }

}

export default new TopicController();