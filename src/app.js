import fastify from 'fastify'
import autoLoad from '@fastify/autoload'
import { join } from 'desm'

export async function buildApp(opts) {
  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    }
  })

  app.register(import('@fastify/postgres'), {
    connectionString: opts.config.PG_CONNECTION_STRING
  })

  app.register(autoLoad, {
    dir: join(import.meta.url, 'services'),
    options: opts
  })

  app.register(import('./graphql/index.js'), opts)

  return app
}
