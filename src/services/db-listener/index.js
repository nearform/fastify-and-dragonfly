import createSubscriber from 'pg-listen'

const MESSAGE_QUEUE = 'users_registration_status_updated'

function createCustomSubscriber(app, opts) {
  const subscriber = createSubscriber({
    connectionString: opts.config.PG_CONNECTION_STRING
  })

  const { dragonFlyClient } = app

  subscriber.notifications.on(MESSAGE_QUEUE, payload => {
    dragonFlyClient.publish(
      MESSAGE_QUEUE,
      JSON.stringify({
        userId: payload.id,
        status: payload.status,
        eventAt: Date.now()
      })
    )
    app.log.info(payload, `Received event in "${MESSAGE_QUEUE}"`)
  })

  subscriber.events.on('error', error => {
    app.log.error(error, 'Fatal database connection error')
    process.exit(1)
  })

  return subscriber
}

export default async function dbListenerService(app, opts) {
  await app.register(import('../../plugins/dragonFly.js'), opts)

  const subscriber = createCustomSubscriber(app, opts)

  await subscriber.connect()
  await subscriber.listenTo('users_registration_status_updated')

  app.addHook('onClose', async () => {
    app.log.info('Bye bye!')
    await subscriber.close()
  })

  app.log.info('Waiting for events...')
}
