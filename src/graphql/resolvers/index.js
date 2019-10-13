const user = require('./user');
const incident = require('./incident');

module.exports = {
  Query: {
    ...user.queries,
    ...incident.queries
  },
  Mutation: {
    ...incident.mutations
  },
  ...incident.types
};
