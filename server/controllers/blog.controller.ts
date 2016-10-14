// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, route, config, Controller } from 'hapi-decorators';

// app
import { getPost, getPostsByCategory, getTopics, getPostByPostId } from '../commands/post.commands';
import { pageHeader } from '../shared/view-matcher';
import { getProtocolByHost } from '../shared/utility';

@controller('/blog')
class BlogController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/{page?}')
    @config({ plugins: { sitemap: { include: true } } })
    index(request: hapi.Request, reply: hapi.IReply) {
        let promises: any[] = [];
        let page = (!isNaN(Number(request.params['page']))) ? Number(request.params['page']) : 1;
        let limit = 10;
        let offset = page <= 1 ? 0 : (page * limit) - limit;
        
        promises.push(getTopics());
        promises.push(getPostsByCategory('blog', true, undefined, offset, limit));
        
        Promise.all(promises).then(data => {
            reply.view('category', {
                title: 'Blog',
                description: '',
                posts: data[1],
                topics: data[0],
                isBlog: true,
                pagination: {
                    basePath: '/blog',
                    pageCount: Math.ceil(data[1].count / limit),
                    page
                }
            });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @route('get', '/post/{id}')
    legacyPost(request: hapi.Request, reply: hapi.IReply) {
        let postId = Number(request.params['id']);
        getPostByPostId(postId).then(post => {
            if (!post) {
                reply(boom.notFound());
                return;
            }
            let host = request.headers['host'];
            let protocol = getProtocolByHost(host);
            let postJSON = post.toJSON();
            if (postJSON.permalink && postJSON.permalink !== 'undefined') {
                let POST_URL = `${protocol}://${host}${postJSON.permalink}`;
                reply.redirect(POST_URL);
            } else {
                reply(boom.notFound());
            }
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/{year}/{month}/{slug}')
    readPost(request: hapi.Request, reply: hapi.IReply) {
        let postSlug: string = request.params['slug'];
        getPost(postSlug, 'blog').then(post => {
            if (!post) {
                reply(boom.notFound());
                return;
            }
            let host = request.headers['host'];
            let protocol = getProtocolByHost(host);
            let postJSON = post.toJSON();
            let POST_URL = `${protocol}://${host}${postJSON.permalink}`;
            reply.view('post', {
                title: postJSON.title,
                post: postJSON,
                POST_URL,
                POST_ID: postJSON.id,
                isBlogPost: true
            }, { layout: 'hero-layout' });
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/feed/rss')
    rssBlog(request: hapi.Request, reply: hapi.IReply) {
        let host = request.headers['host'];
        let title = 'Updates from CSG Pro';
        let description = 'Lastest posts about custom software development and business analytics.';
        let permalink = '/blog/feed/rss';
        getPostsByCategory('blog', undefined, undefined, undefined, 20).then(posts => {
            reply.view('rss', { posts, host, title, description, permalink }, { layout: 'blank' }).type('text/xml');
        }).catch((err: Error) => {
            if (err.name === 'SequelizeConnectionError') {
                reply(boom.create(500, 'Bad Connection'));
            } else {
                reply(boom.create(500, err.message));
            }
        });
    }

    @get('/subscription/thank-you')
    subscriptionThankYou(request: hapi.Request, reply: hapi.IReply) {

        let pageContent = `<div class="callout primary">We need to confirm your email address.<br><br>

        To complete the subscription process, please click the link in the email we just sent you.</div>`;

        reply.view('page', { title: 'Thank You', pageContent });
    }

    @get('/subscription/confirmed')
    subscriptionConfirmed(request: hapi.Request, reply: hapi.IReply) {

        let pageContent = '<div class="callout primary">You will begin receiving updates next Monday.</div>';

        reply.view('page', { title: 'Subscription Confirmed', pageContent });
    }

}

export default new BlogController();