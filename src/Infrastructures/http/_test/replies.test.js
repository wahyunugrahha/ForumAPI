const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

describe("/replies endpoints", () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("when POST /threads/{thread_id}/comments/{comment_id}/replies", () => {
    it("should response 401 when not authenticated", async () => {
      const payload = {
        content: "test",
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments/comment-123/replies",
        payload: payload,
      });

      expect(response.statusCode).toEqual(401);

      const result = JSON.parse(response.payload);
      expect(result.error).toEqual("Unauthorized");
      expect(result.message).toEqual("Missing authentication");
    });

    it("should response 400 when not meet property requirement", async () => {
      const payload = {};

      const server = await createServer(container);

      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments/comment-123/replies",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(400);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual(
        "unable to post new reply due to uncomplete property"
      );
    });

    it("should response 400 when not meet data type requirement", async () => {
      const payload = {
        content: 9.0,
      };

      const server = await createServer(container);

      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-126/comments/comment-123/replies",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(400);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual(
        "unable to post new reply due to invalid data type"
      );
    });

    it("should response 404 when given invalid thread", async () => {
      const payload = {
        content: "testtesttest",
      };

      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments/comment-123/replies",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(404);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Thread not found");
    });

    it("should response 404 when given invalid comment", async () => {
      const payload = {
        content: "testtesttest",
      };

      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      await UsersTableTestHelper.addUser({
        id: "user128",
        username: "testuser8",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread124",
        owner: "user128",
      });

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread124/comments/comment-123/replies",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(404);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Comment not found in this thread!");
    });

    it("should response 201 when meet all requirement and persist comment data", async () => {
      const payload = {
        content: "testtesttest",
      };

      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "test",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread123",
        title: "test",
        owner: "user-124",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-124",
        thread_id: "thread123",
        owner: "user-124",
      });

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments/comment-124/replies",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(201);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");
      expect(result.message).toEqual("SUCCESS_ADDED_NEW_REPLY");
      expect(result.data.addedReply).toBeDefined();
    });
  });

  describe("when DELETE /threads/{thread_id}/comments/{comment_id}/replies/{reply_id}", () => {
    it("should response 403 when non owner try to delete", async () => {
      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        owner: "user-124",
        thread_id: "thread123",
        content: "ini adalah test",
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-126",
        owner: "user-124",
        comment_id: "comment-125",
        content: "ini adalah test",
        thread_id: "thread123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-125/replies/reply-126",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(403);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Your are not the owner of this reply!");
    });

    it("should response 404 when the comment or thread not valid", async () => {
      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-12390/replies/reply-123",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(404);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
    });

    it("should response 200 when the comment successfully deleted", async () => {
      const server = await createServer(container);
      const { token, user_id } = await ServerTestHelper.getCredential(server);

      await CommentsTableTestHelper.addComment({
        id: "comment-126",
        owner: user_id,
        thread_id: "thread123",
        content: "ini adalah test",
      });

      await RepliesTableTestHelper.addReply({
        id: "reply-127",
        owner: user_id,
        comment_id: "comment-126",
        content: "ini adalah test",
        thread_id: "thread123",
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-126/replies/reply-127",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(200);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");
    });
  });
});
