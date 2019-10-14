const path = require('path');
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('../src/graphql/resolvers');

const GET_INCIDENT = `
query GetIncident($id: ID!) {
  incident(id: $id) {
    title
    assignee
  }
}
`;

describe('Incident management system', () => {
  const typeDefs = importSchema(
    path.join(__dirname, '../src/graphql/schemas/schema.graphql')
  );

  it('should return an incident', async () => {
    const _doc = {
      _id: 'id',
      title: 'Test title',
      description: 'Test description',
      assignee: 'test@gmail.com',
      status: 'Created'
    };
    resolvers.Query.incident = jest.fn().mockResolvedValue(_doc);
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const server = new ApolloServer({ schema });
    const { query } = createTestClient(server);

    const res = await query({ query: GET_INCIDENT, variables: { id: 'id' } });
    expect(res).toMatchSnapshot();
  });
});
