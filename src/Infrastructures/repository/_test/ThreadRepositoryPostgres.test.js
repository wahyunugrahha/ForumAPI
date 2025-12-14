const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const GetThread = require("../../../Domains/threads/entities/GetThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("add thread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      const owner = "user-123";
      await UserTableTestHelper.addUser({ id: owner });

      const newThread = new NewThread({
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      const fakeGenerator = () => "123";

      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeGenerator
      );

      const result = await threadRepository.addThread(newThread);
      expect(result).toStrictEqual(
        new AddedThread({
          id: "thread-123", // FIX: Menggunakan format ID yang benar (thread-123)
          title: "test",
          owner: "user-123",
        })
      );

      const expected = await ThreadsTableTestHelper.findThread("thread-123"); // FIX: Menggunakan format ID yang benar (thread-123)
      expect(expected).toHaveLength(1);
    });
  });

  describe("verify thread function", () => {
    it("should throw error 404 when thread not found", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      expect(threadRepository.verifyThread("thread124")).rejects.toThrowError(
        NotFoundError
      );
    });

    it("should not throw error 404 when thread found", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await UserTableTestHelper.addUser({
        id: "user-123",
        username: "testuser123",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread124",
        title: "testcoy",
        body: "testing",
        owner: "user-123",
      });

      await expect(
        threadRepository.verifyThread("thread124")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("find thread function", () => {
    it("should return correcly when thread found", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await UserTableTestHelper.addUser({
        id: "user-123",
        username: "testuser123",
      });

      await ThreadsTableTestHelper.addThread({
        id: "thread124",
        title: "testcoy",
        body: "testing",
        owner: "user-123",
      });

      const result = await threadRepository.findThread("thread124");

      const expectedResult = new GetThread({
        id: "thread124",
        title: "testcoy",
        body: "testing",
        date: new Date("2024-10-26T00:00:00.000Z"),
        username: "testuser123",
        comments: [],
      });
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
