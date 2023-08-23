import {
  getUsers,
  insertUser,
  getRegistrationHistoryByUserIDs,
  updateUserStatus
} from '../libs/db.js'
import { publishUserStatusUpdatedEvent } from '../events/userEvents.js'

export const schema = `
    scalar Date

    enum RegistrationStatus {
      pending
      approved
      rejected
    }

    type User {
      id: ID!
      name: String!
      surname: String!
      status: RegistrationStatus!
      registrationHistory: [RegistrationHistoryRow!]!
    }

    type RegistrationHistoryRow {
      status: RegistrationStatus!
      eventAt: Date!
    }

    input CreateUserInput {
      name: String!
      surname: String!
    }

    type Query {
      getUsers: [User!]!
    }

    type Mutation {
      createUser(user: CreateUserInput!): User!
      approveUser(userId: ID!): User!
      rejectUser(userId: ID!): User!
    }
  `

export const resolvers = {
  Query: {
    getUsers: async (_, __, ctx) => {
      return getUsers(ctx.app.pg)
    }
  },
  Mutation: {
    createUser: async (_, { user }, ctx) => {
      const newUser = await insertUser(ctx.app.pg, user)
      await publishUserStatusUpdatedEvent(ctx.app.dragonFly, newUser)
      return newUser
    },
    approveUser: async (_, { userId }, ctx) => {
      const updatedUser = await updateUserStatus(ctx.app.pg, userId, 'approved')
      await publishUserStatusUpdatedEvent(ctx.app.dragonFly, updatedUser)
      return updatedUser
    },
    rejectUser: async (_, { userId }, ctx) => {
      const updatedUser = await updateUserStatus(ctx.app.pg, userId, 'rejected')
      await publishUserStatusUpdatedEvent(ctx.app.dragonFly, updatedUser)
      return updatedUser
    }
  }
}

export const loaders = {
  User: {
    async registrationHistory(queries, context) {
      const userIdList = queries.map(({ obj }) => obj.id)
      const histories = await getRegistrationHistoryByUserIDs(
        context.app.pg,
        userIdList
      )
      const result = histories.reduce((acc, history) => {
        if (!acc[history.userId]) {
          acc[history.userId] = []
        }
        acc[history.userId].push(history)
        return acc
      }, {})
      return queries.map(({ obj }) => result[obj.id] || [])
    }
  }
}
