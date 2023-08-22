CREATE TYPE registration_statuses AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  surname VARCHAR (50) NOT NULL,
  status registration_statuses NOT NULL
);

CREATE TABLE registration_histories (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  status registration_statuses NOT NULL,
  eventAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_users FOREIGN KEY (userId) REFERENCES users(id)
);
