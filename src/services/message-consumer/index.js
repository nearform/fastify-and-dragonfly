export default async function messageConsumerService(app) {
  app.addHook('onClose', async () => {
    app.log.info('Bye bye!')
  })
}
