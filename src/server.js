const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');

mongoose.Promise = global.Promise;

const { seedUsers } = require('./db-init');
const resolvers = require('./graphql/resolvers');

mongoose
  .connect(config.get('db.uri'), { useNewUrlParser: true })
  .then(async () => {
    console.log('INFO: Connected to the database');

    await seedUsers();

    const typeDefs = importSchema(path.join(__dirname, 'graphql/schemas/schema.graphql'));
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({ schema });

    const app = express();
    server.applyMiddleware({ app });

    const { host, port } = config.get('server');

    app.listen({ port }, () => {
      console.log(
        `Server ready at http://${host}:${port}${server.graphqlPath}`
      );
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(-1);
  });
