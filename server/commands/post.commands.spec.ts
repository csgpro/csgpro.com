// libs
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
const td = require('testdouble');

chai.use(chaiAsPromised);

let expect = chai.expect;

td.replace('../database', td.function());

// stubs
const findOne = td.function();
const getPosts = td.function();
const topicModuleReplacement = { Topic: { findOne } };
const topicInstance = { getPosts };

// replace topic.model with mocked module
td.replace('../models/topic.model', topicModuleReplacement);

import { getTopic } from './post.commands';

td.when(findOne(td.matchers.anything())).thenResolve(topicInstance);
td.when(getPosts(td.matchers.anything())).thenResolve();

describe('getTopic', () => {
    it('should return a promise', () => {
        return expect(getTopic('foo')).to.be.an.instanceOf(Promise);
    });
    
    it('should resolve to an array', () => {
        return expect(getTopic('foo')).to.eventually.be.an.instanceOf(Array).and.have.lengthOf(2);
    });

    it('should resolve to a topic', () => {
        return expect(getTopic('foo', false)).to.eventually.be.equal(topicInstance);
    });
});


