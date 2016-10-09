// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, Controller } from 'hapi-decorators';

// app
import { getTopic, getTopics } from '../commands/post.commands';

@controller('/topic')
class TopicController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];
    
    @get('/')
    index(request: hapi.Request, reply: hapi.IReply) {
        reply.redirect('/blog');
    }

    @get('/{topic}')
    topic(request: hapi.Request, reply: hapi.IReply) {
        let topicSlug: string = request.params['topic'];
        
        let promises: any[] = [];
        
        promises.push(getTopics());
        promises.push(getTopic(topicSlug));
        
        Promise.all(promises).then(data => {
            let [topic, posts] = data[1];
            reply.view('category', { title: topic.topic, description: '', posts, topics: data[0] });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/{topic}/feed/rss')
    rssTopic(request: hapi.Request, reply: hapi.IReply) {
        let topicSlug: string = request.params['topic'];
        let host = request.headers['host'];
        let permalink = `/topic/${topicSlug}/feed/rss`;
        getTopic(topicSlug).then(data => {
            let [topic, posts] = data;
            let title = `CSG Pro ${topic.topic} Posts`;
            let description = `Lastest posts about "${topic.topic}"`;
            reply.view('rss', { posts, host, title, description, permalink }, { layout: 'blank' }).type('text/xml');
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

}

export default new TopicController();