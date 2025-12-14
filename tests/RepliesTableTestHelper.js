/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    owner = "user-123",
    comment_id = "comment-123",
    thread_id = "thread123",
    content = "123",
    date = new Date("2024-10-26T00:00:00.000Z"),
    is_deleted = false,
  }) {
    const query = {
      text: "INSERT INTO replies(id, owner, comment_id, thread_id, content, is_deleted, date) VALUES($1,$2,$3,$4,$5,$6,$7)",
      values: [id, owner, comment_id, thread_id, content, is_deleted, date],
    };

    await pool.query(query);
  },
  async findReply(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id=$1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async softDeleteReply(id) {
    const query = {
      text: "UPDATE replies SET is_deleted=TRUE WHERE id=$1",
      values: [id],
    };

    await pool.query(query);
  },
  async cleanTable() {
    await pool.query("DELETE FROM replies WHERE 1=1");
  },
};

module.exports = RepliesTableTestHelper;
