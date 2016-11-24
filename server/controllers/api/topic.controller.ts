// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

// app
import { getTopics, getTopic } from '../../commands/post.commands';

@controller('/api/topic')
class TopicController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getTopicsApi(request: hapi.Request, reply: hapi.IReply) {
        getTopics().then(topics => {
            reply({ data: topics });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, err.message));
            }
        });
    }

    @get('/{id}')
    @config({
        auth: 'jwt'
    })
    async getTopicApi(request: hapi.Request, reply: hapi.IReply) {
        let { id } = request.params;
        let topicId = Number(id);

        try {
            let topic = await getTopic(topicId);
            reply({ data: topic });
        } catch (exc) {
            let error = exc && exc.message ? exc.message : exc;
            console.error(exc && exc.stack ? exc.stack : exc);
            if (exc.name === 'SequelizeConnectionError') {
                reply(boom.create(503, 'Bad Connection'));
            } else {
                reply(boom.create(503, error));
            }
        }
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createTopicApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updateTopicApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    deleteTopicApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }
}

export default new TopicController();