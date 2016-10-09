// libs
import * as request from 'request';
import * as events from 'events';

// app
import { database } from '../database';
import { Webhook, IWebhookInstance } from '../models/webhook.model';
import { WebhookEvent } from '../models/webhook-event.model';

let _webhooks: { [event: string]: string[] } = {};
let _eventEmitter = new events.EventEmitter();

setTimeout(() => {
    syncWebhooks();
}, 5000);

export function getWebhooks() {
    return Webhook.findAndCountAll().then(data => {
        let webhooks = [...data.rows];
        Object.defineProperty(webhooks, 'count', {
            value: data.count
        });
        return webhooks;
    });
}

export function getWebhook(id: number) {
    return Webhook.findOne({ where: { id } });
}

export function createWebhook(webhook: any) {
    let events: any[] = webhook.webhookEvents;
    return database.transaction(function(t) {
        return Webhook.create(webhook, { transaction: t }).then(wh => {
            if (events && events.length) {
                let queue = events.map(e => WebhookEvent.findOne({ where: { id: e.id }, transaction: t }));

                return Promise.all(queue).then(eventsArray => {
                    return wh.setWebhookEvents(eventsArray, { transaction: t }).then(() => wh);
                });
            } else {
                return wh.setWebhookEvents([], { transaction: t }).then(() => wh);
            }
        });
    }).then(wh => {
        syncWebhooks();
        return wh;
    }).catch((err) => {
        console.error(err.stack || err);
        throw new Error('Unable to create webhook');
    });
}

export function updateWebhook(webhook: any) {
    let events: any[] = webhook.webhookEvents;
    return database.transaction(function(t) {
        return Webhook.update(webhook, { where: { id: webhook.id }, transaction: t }).then(([affected, [wh]]) => {
            if (events && events.length) {
                let queue = events.map(e => WebhookEvent.findOne({ where: { id: e.id } }));

                return Promise.all(queue).then(eventsArray => {
                    return wh.setWebhookEvents(eventsArray, { transaction: t }).then(() => wh);
                });
            } else {
                return wh.setWebhookEvents([], { transaction: t }).then(() => wh);
            }
        });
    }).then(wh => {
        syncWebhooks();
        return wh;
    }).catch((err) => {
        console.error(err.stack || err);
        throw new Error('Unable to update webhook');
    });
}

export function deleteWebhook(id: number) {
    return Webhook.destroy({ where: { id } });
}

export function syncWebhooks() {
    removeWebhooks(() => {
        getWebhooks()
            .then((webhooks) => {
                webhooks.forEach(webhook => {
                    webhook.countWebhookEvents().then(count => {
                        if (count) {
                            webhook.getWebhookEvents().then(events => {
                                events.forEach(ev => {
                                    let event = ev.toJSON();
                                    if (webhooks.hasOwnProperty(event.event)) {
                                        _webhooks[event.event].push(webhook.getDataValue('url'));
                                    } else {
                                        _webhooks[event.event] = [webhook.getDataValue('url')];
                                    }
                                    _eventEmitter.on(event.event, (data) => {
                                        post(webhook.getDataValue('url'), data).then(r => {
                                            console.log('[webhook complete]:', webhook.getDataValue('url'));
                                            console.log(r);
                                        }).catch((err) => {
                                            console.error('[webhook error]:', webhook.getDataValue('url'));
                                            console.error(err.stack || err);
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            })
            .catch((err) => {
                console.error('Unable to retrieve webhooks');
                console.error(err.stack || err);
            });
    });
}

function removeWebhooks(cb: Function) {
    for (let event in _webhooks) {
        _eventEmitter.removeAllListeners(event);
    }
    _webhooks = {};
    cb();
}

export function triggerWebhooks(event: WebhookEvents, data: any): void {
    data.action = data.action || WebhookEvents[event];
    console.info('[webhook triggered]', 'Event:', WebhookEvents[event]);
    _eventEmitter.emit(WebhookEvents[event], data);
}

function post(url: string, data): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            request.post(url, { body: JSON.stringify(data) }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * WebhookEvents enums need to stay in sync w/ webhookEvents table
 */
export enum WebhookEvents {
    CreatePost      = 1,
    UpdatePost      = 2,
    DeletePost      = 3,
    PublishPost     = 4,
    CreateUser      = 5,
    UpdateUser      = 6,
    DeleteUser      = 7,
    CreateStory     = 8,
    UpdateStory     = 9,
    DeleteStory     = 10,
    ContactRequest  = 11,
    DownloadRequest = 12
}