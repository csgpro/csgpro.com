// libs
const td = require('testdouble');

td.config({
  promiseConstructor: require('bluebird')
});

export const testdouble = td;

export * from './post.model.helper';
export * from './topic.model.helper';
export * from './transaction.helper';