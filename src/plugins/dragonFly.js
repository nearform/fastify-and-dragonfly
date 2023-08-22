export default async function dragonFlyPlugin(app, opts) {
  await app.register(import('@fastify/redis'), {
    host: opts.config.DRAGONFLY_HOST,
    port: opts.config.DRAGONFLY_PORT
  })

  app.decorate('dragonFlyClient', app.redis)
}
dragonFlyPlugin[Symbol.for('skip-override')] = true
