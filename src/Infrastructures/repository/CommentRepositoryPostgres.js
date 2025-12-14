const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { thread_id, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const del = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content,owner",
      values: [id, owner, thread_id, content, del, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async softDeleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_deleted=true WHERE id=$1",
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(id, user) {
    const query = {
      text: "SELECT * FROM comments WHERE id=$1 AND owner=$2",
      values: [id, user],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError("Your are not the owner of this comment!");
    }
  }

  async verifyCommentThread(comment_id, thread_id) {
    const query = {
      text: "SELECT * FROM comments WHERE id=$1 AND thread_id=$2",
      values: [comment_id, thread_id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Comment not found in this thread!");
    }
  }

  async getThreadComments(id) {
    const query = {
      text: "SELECT comments.id, comments.content, comments.date, comments.is_deleted, users.username FROM comments JOIN users ON users.id = comments.owner WHERE thread_id=$1 ORDER BY date ASC",
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
