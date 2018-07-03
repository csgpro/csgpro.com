// libs
import * as Sequelize from 'sequelize';
import * as _ from 'lodash';

// app
import { Story } from '../models/story.model';

export async function getStories(scope = 'active', search?: string | Sequelize.WhereOptions, sortOrder: 'ASC' | 'DESC' = 'DESC', offset?: number, limit = 6) {
    let where: Sequelize.WhereOptions;
    if (search) {
        if (typeof search === 'string') {
            search = `%${search}%`;
            where = {
                $or: [
                    {
                        title: {
                            $like: search
                        }
                    },
                    {
                        body: {
                            $like: search
                        }
                    }
                ]
            };
        } else {
            where = <Sequelize.WhereOptions>search;
        }
    }
    return await Story.scope(scope).findAndCount({
        where,
        order: [['createdAt', sortOrder]],
        offset,
        limit
    });
}