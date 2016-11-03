// libs
const td = require('testdouble');

export const transaction = td.function();
export const transactionInstance = { commit: td.function(), rollback: td.function() };

const databaseReplacement = { default: { transaction } };

td.replace('../database', databaseReplacement);

td.when(transaction()).thenResolve(transactionInstance);