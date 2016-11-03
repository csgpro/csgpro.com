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
    
    it('should resolve to a existing post w/ topics', () => {
        let post: any = { id: 1, topics: [{ id: 1, topic: 'test' }] };
        return expect(savePost(post)).to.eventually.be.equal(helpers.postInstance)
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

    it('should resolve to a new post w/o topics', () => {
        return expect(savePost(<any>{})).to.eventually.be.equal(helpers.postInstance)
        .then(() => {
            return td.verify(helpers.postModule.Post.create({}), { times: 1, ignoreExtraArgs: true });
        })
        .then(() => {
            return td.verify(helpers.postInstance.setTopics([]), { times: 1, ignoreExtraArgs: true });
        });
    });
});


