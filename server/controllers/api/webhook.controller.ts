// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

@controller('/api/webhook')
class WebhookController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getWebhooksApi(request: hapi.Request, reply: hapi.IReply) {
        // getWebhooks().then(categories => {
        //     reply({ data: categories });
        // }).catch((err: Error) => {
        //     if (err.name === 'SequelizeConnectionError') {
        //         reply(boom.create(503, 'Bad Connection'));
        //     } else {
        //         reply(boom.create(503, err.message));
        //     }
        // });
        reply(boom.notImplemented());
    }

    @get('/{id}')
    @config({
        auth: 'jwt'
    })
    getWebhookApi(request: hapi.Request, reply: hapi.IReply) {
        // let webhookId = Number(request.params['id']);
        // getWebhook(webhookId).then(webhook => {
        //     reply({ data: webhook });
        // }).catch((err: Error) => {
        //     if (err.name === 'SequelizeConnectionError') {
        //         reply(boom.create(503, 'Bad Connection'));
        //     } else {
        //         reply(boom.create(503, err.message));
        //     }
        // });
        reply(boom.notImplemented());
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createWebhookApi(request: hapi.Request, reply: hapi.IReply) {
        // let webhook = request.payload;
        // createWebhook(webhook).then(data => {
        //     reply({ message: 'saved', data });
        // }).catch((err: Error) => {
        //     if (err.name === 'SequelizeConnectionError') {
        //         reply(boom.create(503, 'Bad Connection'));
        //     } else {
        //         reply(boom.create(503, err.message));
        //     }
        // });
        reply(boom.notImplemented());
    }

    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updateWebhookApi(request: hapi.Request, reply: hapi.IReply) {
        // let webhook = request.payload;
        // updateWebhook(webhook).then(data => {
        //     reply({ message: 'saved', data });
        // }).catch((err: Error) => {
        //     if (err.name === 'SequelizeConnectionError') {
        //         reply(boom.create(503, 'Bad Connection'));
        //     } else {
        //         reply(boom.create(503, err.message));
        //     }
        // });
        reply(boom.notImplemented());
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    deleteWebhookApi(request: hapi.Request, reply: hapi.IReply) {
        // let webhookId = Number(request.params['id']);
        // deleteWebhook(webhookId).then(count => {
        //     if (count) {
        //         reply({ message: 'deleted', });
        //     } else {
        //         reply({ message: 'zero affected rows' });
        //     }
        // }).catch((err: Error) => {
        //     if (err.name === 'SequelizeConnectionError') {
        //         reply(boom.create(503, 'Bad Connection'));
        //     } else {
        //         reply(boom.create(503, err.message));
        //     }
        // });
        reply(boom.notImplemented());
    }
}

export default new WebhookController();