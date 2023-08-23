import { buildApp } from './app.js'
import config from './libs/config.js'

const app = await buildApp({ config })
app.listen({
  port: config.PORT,
  host: '0.0.0.0'
})
