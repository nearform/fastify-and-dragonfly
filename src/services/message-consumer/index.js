import { insertRegistrationHistoryRow } from '../../libs/db.js'

const MESSAGE_QUEUE = 'users_registration_status_updated'

export default async function messageConsumerService(app, opts) {
  await app.register(import('../../plugins/dragonFly.js'), opts)
  const { dragonFlyClient } = app

  await dragonFlyClient.subscribe(MESSAGE_QUEUE)
  dragonFlyClient.on('message', async (channel, message) => {
    const event = JSON.parse(message)
    await insertRegistrationHistoryRow(app.pg, event)
    app.log.info(message, `Received event in "${channel}"`)
  })

  app.addHook('onClose', async () => {
    await dragonFlyClient.unsubscribe(MESSAGE_QUEUE)
    app.log.info('Bye bye!')
  })
}
