import fp from 'fastify-plugin'

async function dragonFlyPlugin(app, opts) {
  await app.register(import('@fastify/redis'), {
    host: opts.config.DRAGONFLY_HOST,
    port: opts.config.DRAGONFLY_PORT
  })

  app.decorate('dragonFly', app.redis)
}

export default fp(dragonFlyPlugin, {
  fastify: '4.x',
  name: 'dragon-fly'
})
