import { insertRegistrationHistoryRow } from '../../libs/db.js'
import { USER_STATUS_UPDATED_EVENT } from '../../events/userEvents.js'

export default async function messageConsumerService(app, opts) {
  await app.register(import('../../plugins/dragonFly.js'), opts)
  const { dragonFly } = app

  await dragonFly.subscribe(USER_STATUS_UPDATED_EVENT)
  dragonFly.on('message', async (channel, message) => {
    const event = JSON.parse(message)
    await insertRegistrationHistoryRow(app.pg, event)
    app.log.info(message, `Received event in "${channel}"`)
  })

  app.addHook('onClose', async () => {
    await dragonFly.unsubscribe(USER_STATUS_UPDATED_EVENT)
    app.log.info('Bye bye!')
  })
}
