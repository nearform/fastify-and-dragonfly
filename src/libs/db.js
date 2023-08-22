function mapHistoryRow(row) {
  const { userid, status, eventat } = row
  return { userId: userid, status, eventAt: eventat }
}

export async function getUsers(db) {
  const { rows } = await db.query('SELECT * FROM users ORDER BY id ASC')
  return rows
}

export async function insertUser(db, user) {
  const { name, surname } = user
  const { rows } = await db.query(
    `INSERT INTO users (name, surname, status) VALUES ($1, $2, $3) RETURNING *`,
    [name, surname, 'pending']
  )
  return rows[0]
}

export async function updateUserStatus(db, userId, status) {
  const { rows } = await db.query(
    `
    UPDATE users SET status = $1 WHERE id = $2 RETURNING *
    `,
    [status, userId]
  )
  return rows[0]
}

export async function getRegistrationHistoryByUserIDs(db, userIdList) {
  const { rows } = await db.query(
    `SELECT * FROM registration_histories WHERE userId = ANY($1)ORDER BY userId, eventAt ASC`,
    [userIdList]
  )
  return rows.map(mapHistoryRow)
}

export function insertRegistrationHistoryRow(db, userEvent) {
  const { userId, status, eventAt } = userEvent
  return db.query(
    `INSERT INTO registration_histories (userId, status, eventAt) VALUES ($1, $2, TO_TIMESTAMP($3 / 1000.0))`,
    [userId, status, eventAt]
  )
}
