/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    owner = "user-123",
    thread_id = "thread123",
    content = "123",
    date = new Date("2024-10-26T00:00:00.000Z"),
    is_deleted = false,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1,$2,$3,$4,$5,$6)",
      values: [id, owner, thread_id, content, is_deleted, date],
    };

    await pool.query(query);
  },
  async findComment(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id=$1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async softDeleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_deleted=true WHERE id=$1",
      values: [id],
    };

    await pool.query(query);
  },
  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
