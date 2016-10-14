// libs
import * as hapi from 'hapi';
import * as boom from 'boom';
import { controller, get, post, put, config, route, Controller } from 'hapi-decorators';

// app
import { getPostCategories, getPostCategory } from '../../commands/post.commands';

@controller('/api/category')
class CategoryController implements Controller {
    baseUrl: string;
    routes: () => hapi.IRouteConfiguration[];

    @get('/')
    @config({
        auth: 'jwt'
    })
    getPostCategoriesApi(request: hapi.Request, reply: hapi.IReply) {
        getPostCategories().then(categories => {
            reply({ data: categories });
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
    getPostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
        let categoryId = +request.params['id'];
        getPostCategory(categoryId).then(category => {
            if (!category) {
                reply(boom.notFound());
                return;
            }
            reply({ data: category.toJSON() });
        });
    }

    @post('/')
    @config({
        auth: 'jwt'
    })
    createPostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @put('/{id}')
    @config({
        auth: 'jwt'
    })
    updatePostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }

    @route('delete', '/{id}')
    @config({
        auth: 'jwt'
    })
    deletePostCategoryApi(request: hapi.Request, reply: hapi.IReply) {
        reply(boom.notImplemented());
    }
}

export default new CategoryController();