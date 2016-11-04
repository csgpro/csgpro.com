// libs
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

let expect = chai.expect;

import * as helpers from '../test-helpers';

const td = helpers.testdouble;

import { getTopic, savePost } from './post.commands';

describe('getTopic', () => {
    it('should resolve to an array', () => {
        return expect(getTopic('foo')).to.eventually.be.an.instanceOf(Array).and.have.lengthOf(2);
    });

    it('should resolve to a topic', () => {
        return expect(getTopic('foo', false)).to.eventually.be.equal(helpers.topicInstance);
    });
});

describe('savePost', () => {

    afterEach(() => {
        // TODO: implement td.reset()
    });
    
    it('should find and update existing post w/ topics', () => {
        let post: any = { id: 1, topics: [{ id: 1, topic: 'test' }] };
        return savePost(post)
        .then(() => {
            return td.verify(helpers.postModule.Post.findById(1), { times: 1, ignoreExtraArgs: true });
        })
        .then(() => {
            return td.verify(helpers.postInstance.update(post), { times: 1, ignoreExtraArgs: true });
        })
        .then(() => {
            return td.verify(helpers.postInstance.setTopics([helpers.topicInstance]), { times: 1, ignoreExtraArgs: true });
        });
    });

    it('should create a new post w/o topics', () => {
        return savePost(<any>{})
        .then(() => {
            return td.verify(helpers.postModule.Post.create({ authorId: null, categoryId: null }), { times: 1, ignoreExtraArgs: true });
        })
        .then(() => {
            return td.verify(helpers.postInstance.setTopics([]), { times: 1, ignoreExtraArgs: true });
        });
    });

    it('should throw an error when passed undefined', () => {
        return expect(savePost(<any>undefined)).to.eventually.be.rejectedWith(undefined);
    });
});


