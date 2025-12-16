/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = "like-123",
    commentId = "comment-123",
    owner = "user-123",
    date = new Date("2024-10-27T00:00:00.000Z"),
  }) {
    const query = {
      text: "INSERT INTO comment_likes VALUES($1,$2,$3,$4)",
      values: [id, commentId, owner, date],
    };

    await pool.query(query);
  },

  async findCommentLike({ commentId, owner }) {
    const query = {
      text: "SELECT * FROM comment_likes WHERE comment_id=$1 AND owner=$2",
      values: [commentId, owner],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comment_likes WHERE 1=1");
  },
};

module.exports = CommentLikesTableTestHelper;
