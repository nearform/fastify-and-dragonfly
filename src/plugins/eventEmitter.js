import { randomUUID } from 'crypto'
import fp from 'fastify-plugin'

async function eventEmitterPlugin(app) {
  function buildEvent(payload) {
    return {
      eventId: randomUUID(),
      payload,
      eventAt: Date.now()
    }
  }

  async function publishEvent(eventName, payload) {
    const event = buildEvent(payload)
    return await app.dragonFly.publish(eventName, JSON.stringify(event))
  }

  const emitter = {
    publishEvent
  }

  app.decorate('eventEmitter', emitter)
}

export default fp(eventEmitterPlugin, {
  fastify: '4.x',
  dependencies: ['dragon-fly'],
  name: 'event-emitter'
})
