import { join } from 'desm'
import envSchema from 'env-schema'
import S from 'fluent-json-schema'

const schema = S.object()
  .prop('PG_CONNECTION_STRING', S.string().required())
  .prop('DRAGONFLY_HOST', S.string().required())
  .prop('DRAGONFLY_PORT', S.number().required())
  .prop('PORT', S.number().required())

export default envSchema({
  schema,
  dotenv: { path: join(import.meta.url, '../../.env') }
})
