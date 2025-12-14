const AddedThread = require("../../Domains/threads/entities/AddedThread");
const GetThread = require("../../Domains/threads/entities/GetThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;

    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, owner, body, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async verifyThread(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id=$1",
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Thread not found");
    }
  }

  async findThread(id) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.date AS date, users.username FROM threads JOIN users ON users.id = threads.owner WHERE threads.id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    return new GetThread({ ...rows[0], comments: [] });
  }
}

module.exports = ThreadRepositoryPostgres;
