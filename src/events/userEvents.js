import { randomUUID } from 'crypto'

export const USER_STATUS_UPDATED_EVENT = 'users_status_updated'

function buildUserStatusUpdatedEvent(user) {
  return {
    eventId: randomUUID(),
    user,
    eventAt: Date.now()
  }
}

export async function publishUserStatusUpdatedEvent(client, user) {
  const event = buildUserStatusUpdatedEvent(user)
  return await client.publish(USER_STATUS_UPDATED_EVENT, JSON.stringify(event))
}
