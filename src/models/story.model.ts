'use strict';

import * as Sequelize from 'sequelize';
import { database } from '../database';

export interface IStoryAttributes {
    id: number,
    title: string;
    body: string;
    downloadUrl: string;
    slug: string;
    isActive: boolean;
    inSlider: boolean;
    sliderImageUrl: string;
    permalink?: string;
}

export interface IStoryInstance extends Sequelize.Instance<IStoryAttributes> {};

let StorySchema: Sequelize.DefineAttributes = {
    title: { type: Sequelize.STRING, unique: true, allowNull: false },
    body: { type: Sequelize.TEXT, allowNull: false },
    downloadUrl: Sequelize.STRING,
    slug: { type: Sequelize.STRING, unique: true, allowNull: false },
    isActive: Sequelize.BOOLEAN,
    inSlider: Sequelize.BOOLEAN,
    sliderImageUrl: Sequelize.STRING
};

let StorySchemaOptions: Sequelize.DefineOptions<IStoryInstance> = {
    scopes: {
        active: {
            where: {
                isActive: true
            }
        },
        featured: {
            where: {
                inSlider: true
            }
        }
    },
    instanceMethods: {},
    getterMethods: {
        permalink: function getStoryPermalink(): string {
            let self: IStoryInstance = this;
            let permalink: string;
            let slug = self.getDataValue('slug');
            
            permalink = `/stories/${slug}`;
            
            return permalink;
        }
    }
};

export let Story = database.define<IStoryInstance, IStoryAttributes>('story', StorySchema, StorySchemaOptions);