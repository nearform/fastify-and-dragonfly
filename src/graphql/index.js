import mercurius from 'mercurius'
import mercuriusCache from 'mercurius-cache'
import { loaders, resolvers, schema } from './graphql.js'

export default async function graphqlService(app, opts) {
  await app.register(import('../plugins/dragonFly.js'), opts)
  await app.register(import('../plugins/eventEmitter.js'), opts)
  const { dragonFly } = app

  await app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true
  })

  await app.register(mercuriusCache, {
    ttl: 10,
    storage: {
      type: 'redis',
      options: {
        client: dragonFly,
        invalidation: true
      }
    },
    policy: {
      Query: {
        getUsers: {
          references: (_, __, result) => {
            if (!result) {
              return
            }
            return ['users']
          }
        }
      },
      Mutation: {
        createUser: {
          invalidate: () => ['users']
        },
        approveUser: {
          invalidate: (_, __, result) => {
            if (!result) {
              return
            }
            const references = [`users:${result.id}:history`]
            return references
          }
        },
        rejectUser: {
          invalidate: (_, __, result) => {
            if (!result) {
              return
            }
            const references = [`users:${result.id}:history`]
            return references
          }
        }
      },
      User: {
        registrationHistory: {
          references: (_, __, result) => {
            if (!result) {
              return
            }
            const references = result.map(user => `users:${user.id}:history`)
            return references
          }
        }
      }
    }
  })
}
