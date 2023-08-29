import mercurius from 'mercurius'
import { schema, resolvers, loaders } from './graphql.js'

export default async function graphqlService(app, opts) {
  await app.register(import('../plugins/dragonFly.js'), opts)

  await app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true
  })
}
