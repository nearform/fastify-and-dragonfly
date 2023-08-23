export default async function dragonFlyPlugin(app, opts) {
  await app.register(import('@fastify/redis'), {
    host: opts.config.DRAGONFLY_HOST,
    port: opts.config.DRAGONFLY_PORT
  })

  app.decorate('dragonFly', app.redis)
}
dragonFlyPlugin[Symbol.for('skip-override')] = true
