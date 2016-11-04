// libs
const td = require('testdouble');

// static Methods
const findById = td.function();
const findOne = td.function();
const create = td.function();

// instance Methods
const setTopics = td.function();
const update = td.function();
const getDataValue = td.function();

export const postInstance = { setTopics, update, getDataValue };

// apply stubs
export const postModule = { Post: { findOne, findById, create } };

td.replace('../models/post.model', postModule);

td.when(findById(td.matchers.anything(), td.matchers.anything())).thenResolve(postInstance);
td.when(findOne(td.matchers.anything(), td.matchers.anything())).thenResolve(postInstance);
td.when(create(td.matchers.not(undefined), td.matchers.anything())).thenResolve(postInstance);
td.when(setTopics(td.matchers.anything(), td.matchers.anything())).thenResolve(postInstance);
td.when(update(td.matchers.anything(), td.matchers.anything())).thenResolve(postInstance);