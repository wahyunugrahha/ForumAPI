/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thread123",
    title = "123",
    owner = "user-123",
    body = "123",
    date = new Date("2024-10-26T00:00:00.000Z"),
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1,$2,$3,$4,$5)",
      values: [id, title, owner, body, date],
    };

    await pool.query(query);
  },
  async findThread(id) {
    const query = {
      text: "SELECT threads.*, users.username FROM threads JOIN users ON users.id = threads.owner WHERE threads.id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
