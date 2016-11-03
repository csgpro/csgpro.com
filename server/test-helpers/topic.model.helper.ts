// libs
const td = require('testdouble');

// static Methods
const findById = td.function();
const findOne = td.function();
const create = td.function();

// instance Methods
const getPosts = td.function();
const update = td.function();

export const topicInstance = { getPosts, update };

// apply stubs
const topicModuleReplacement = { Topic: { findById, findOne, create } };

td.replace('../models/topic.model', topicModuleReplacement);

td.when(findById(td.matchers.anything(), td.matchers.anything())).thenResolve(topicInstance);
td.when(findOne(td.matchers.anything())).thenResolve(topicInstance);
td.when(getPosts(td.matchers.anything())).thenResolve();