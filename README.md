# Fastify and DragonFly as a new possible alternative to scale you applications

## Setup

First enable docker on your machine; then run the following command:

```bash
npm ci

npm run infra:up
npm run db:migrate
```

### Run

```bash
npm run dev
```

### GraphQL UI

You can find the graphQL UI at: http://localhost:3000/graphiql

And here are some queries you can try:

```graphql
query Users {
  getUsers {
    id
    name
    surname
    status
    registrationHistory {
      status
      eventAt
    }
  }
}

mutation CreateUser {
  createUser(user: { name: "Test name", surname: "Test surname" }) {
    id
    name
    surname
    status
  }
}

mutation ApproveUser {
  approveUser(userId: "1") {
    id
    name
    surname
    status
    registrationHistory {
      status
      eventAt
    }
  }
}

mutation RejectUser {
  rejectUser(userId: "7") {
    id
    name
    surname
    status
    registrationHistory {
      status
      eventAt
    }
  }
}
```
