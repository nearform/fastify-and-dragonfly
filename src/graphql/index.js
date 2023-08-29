import mercurius from 'mercurius'
import { schema, resolvers, loaders } from './graphql.js'

export default async function graphqlService(app) {
  await app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true
  })
}
