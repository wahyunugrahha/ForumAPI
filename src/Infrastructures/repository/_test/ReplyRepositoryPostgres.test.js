const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const GetReply = require("../../../Domains/replies/entities/GetReply");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepository Postgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("add reply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      const owner = "user-123";
      await UsersTableTestHelper.addUser({ id: owner });

      const thread_id = "thread123";
      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: thread_id,
        content: "test",
        owner: owner,
      });

      const fakeGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      const newReply = new NewReply({
        thread_id: "thread123",
        comment_id: "comment-123",
        content: "test",
        owner: "user-123",
      });

      const replyResult = await replyRepository.addReply(newReply);

      expect(replyResult).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "test",
          owner: "user-123",
        })
      );

      const expected = await RepliesTableTestHelper.findReply("reply-123");
      expect(expected).toHaveLength(1);
    });
  });

  describe("verify reply status function", () => {
    it("should throw error when reply not found", async () => {
      const fakeGenerator = () => "123";

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      await expect(
        replyRepository.verifyReplyStatus("reply-123", "comment-1230")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw error when reply not found", async () => {
      const owner = "user-123";
      await UsersTableTestHelper.addUser({ id: owner });

      const thread_id = "thread123";
      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: thread_id,
        content: "test",
        owner: owner,
      });

      const fakeGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      await RepliesTableTestHelper.addReply({
        reply_id: "reply-123",
        comment_id: "comment-123",
        content: "test",
        owner: owner,
      });

      expect(
        replyRepository.verifyReplyStatus(
          "reply-123",
          "comment-123",
          "thread123"
        )
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("verify reply owner function", () => {
    it("should throw error when not reply owner", async () => {
      const fakeGenerator = () => "123";

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      await expect(
        replyRepository.verifyReplyOwner("reply-123", "user-128")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw error when is reply owner", async () => {
      const owner = "user-123";
      await UsersTableTestHelper.addUser({ id: owner });

      const thread_id = "thread123";
      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: thread_id,
        content: "test",
        owner: owner,
      });

      const fakeGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        comment_id: "comment-123",
        content: "test",
        owner: owner,
      });

      expect(
        replyRepository.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("delete reply function", () => {
    it("should delete reply correctly", async () => {
      const owner = "user-123";
      await UsersTableTestHelper.addUser({ id: owner });

      const thread_id = "thread123";
      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        thread_id: thread_id,
        content: "test",
        owner: owner,
      });

      const fakeGenerator = () => "123";
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeGenerator);

      const newReply = new NewReply({
        thread_id: "thread123",
        comment_id: "comment-123",
        content: "test",
        owner: owner,
      });

      const replyResult = await replyRepository.addReply(newReply);

      const finding1 = await RepliesTableTestHelper.findReply(replyResult.id);
      expect(finding1[0].is_deleted).toEqual(false);

      await replyRepository.softDeleteReply(replyResult.id);

      const finding2 = await RepliesTableTestHelper.findReply(replyResult.id);
      expect(finding2[0].is_deleted).toEqual(true);
    });
  });

  describe("get thread replies function", () => {
    it("should return empty replies correctly", async () => {
      const owner = "user-123";
      const thread_id = "thread123";
      const date = new Date("2024-10-26T00:00:00.000Z");

      await UsersTableTestHelper.addUser({ id: owner, username: "test" });

      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        content: "testkomen",
        owner: "user-123",
        thread_id: thread_id,
        date: date,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "testcomment",
        owner: "user-123",
        thread_id: thread_id,
        date: date,
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepository.getThreadReplies(thread_id);

      expect(result).toHaveLength(0);
      expect(result).toStrictEqual([]);
    });

    it("should return replies correctly", async () => {
      const owner = "user-123";
      const thread_id = "thread123";
      const date1 = new Date("2024-10-26T00:00:00.000Z");
      const date2 = new Date("2024-10-27T00:00:00.000Z");
      const date3 = new Date("2024-10-28T00:00:00.000Z");

      await UsersTableTestHelper.addUser({ id: owner, username: "test" });

      await ThreadsTableTestHelper.addThread({
        id: thread_id,
        title: "test",
        body: "this is testing data",
        owner: owner,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        content: "testkomen",
        owner: "user-123",
        thread_id: thread_id,
        date: date2,
      });

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        content: "testcomment",
        owner: "user-123",
        thread_id: thread_id,
        date: date1,
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        comment_id: "comment-123",
        content: "testcomment",
        owner: "user-123",
        date: date1,
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-124",
        comment_id: "comment-123",
        content: "1 comment",
        owner: "user-123",
        date: date2,
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-125",
        comment_id: "comment-125",
        content: "2 comment",
        owner: "user-123",
        date: date3,
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepository.getThreadReplies(thread_id);

      expect(result).toHaveLength(3);
      expect(result).toStrictEqual([
        {
          id: "reply-123",
          comment_id: "comment-123",
          content: "testcomment",
          username: "test",
          date: date1,
          is_deleted: false,
          thread_id: "thread123",
          owner: "user-123",
        },
        {
          id: "reply-124",
          comment_id: "comment-123",
          content: "1 comment",
          username: "test",
          date: date2,
          is_deleted: false,
          thread_id: "thread123",
          owner: "user-123",
        },
        {
          id: "reply-125",
          comment_id: "comment-125",
          content: "2 comment",
          username: "test",
          date: date3,
          is_deleted: false,
          thread_id: "thread123",
          owner: "user-123",
        },
      ]);
    });
  });
});
