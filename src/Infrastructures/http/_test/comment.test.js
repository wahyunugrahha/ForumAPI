const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const createServer = require("../createServer");
const container = require("../../container");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentLikesTableTestHelper = require("../../../../tests/CommentLikesTableTestHelper"); // New Helper

describe("/comments endpoints", () => {
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable(); // Cleanup new table
    await pool.end();
  });

  describe("when POST /threads/{thread_id}/comments", () => {
    it("should response 401 when not authenticated", async () => {
      const payload = {
        content: "test",
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments",
        payload: payload,
      });

      expect(response.statusCode).toEqual(401);

      const result = JSON.parse(response.payload);
      expect(result.error).toEqual("Unauthorized");
      expect(result.message).toEqual("Missing authentication");
    });

    if (
      ("should response 400 when not meet property requirement",
      async () => {
        const payload = {};

        const server = await createServer(container);

        const { token } = await ServerTestHelper.getCredential(server);

        const response = await server.inject({
          method: "POST",
          url: "/threads/thread123/comments",
          payload: payload,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        expect(response.statusCode).toEqual(400);

        const result = JSON.parse(response.payload);
        expect(result.status).toEqual("fail");
        expect(result.message).toEqual(
          "unable to post new comment due to uncomplete property"
        );
      })
    );

    if (
      ("should response 400 when not meet data type requirement",
      async () => {
        const payload = {
          content: 9.0,
        };

        const server = await createServer(container);

        const { token } = await ServerTestHelper.getCredential(server);

        const response = await server.inject({
          method: "POST",
          url: "/threads/thread-126/comments",
          payload: payload,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        expect(response.statusCode).toEqual(400);

        const result = JSON.parse(response.payload);
        expect(result.status).toEqual("fail");
        expect(result.message).toEqual(
          "unable to post new comment due to invalid data type"
        );
      })
    );

    it("should response 404 when given invalid thread", async () => {
      const payload = {
        content: "testtesttest",
      };

      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments",
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

    it("should response 201 when meet all requirement and persist comment data", async () => {
      const payload = {
        content: "testtesttest",
      };

      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "test2",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread123",
        title: "test",
        owner: "user-124",
      });

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread123/comments",
        payload: payload,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(201);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");
      expect(result.message).toEqual("SUCCESS_ADDED_NEW_COMMENT");
      expect(result.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{thread_id}/comments/{comment_id}", () => {
    it("should response 403 when non owner try to delete", async () => {
      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        owner: "user-124",
        thread_id: "thread123",
        content: "ini adalah test",
      });

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-125",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(403);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Your are not the owner of this comment!");
    });

    it("should response 404 when the comment or thread not valid", async () => {
      const server = await createServer(container);
      const { token } = await ServerTestHelper.getCredential(server);

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-12390",
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

      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread123/comments/comment-126",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toEqual(200);

      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");
    });
  });

  describe("when PUT /threads/{thread_id}/comments/{comment_id}/likes", () => {
    let server;
    let user1Cred;
    let user2Cred;
    const threadId = "thread-like-test";
    const commentId = "comment-like-test";

    beforeAll(async () => {
      server = await createServer(container);
      user1Cred = await ServerTestHelper.getCredential(server, {
        id: "user-liker",
        username: "liker",
      });

      user2Cred = await ServerTestHelper.getCredential(server, {
        id: "user-comment-owner",
        username: "commentowner",
      });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: user2Cred.user_id,
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread_id: threadId,
        owner: user2Cred.user_id,
      });
    });

    afterAll(async () => {
      await CommentLikesTableTestHelper.cleanTable();

      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await AuthenticationsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    it("should response 401 when not authenticated", async () => {
      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
      const result = JSON.parse(response.payload);
      expect(result.error).toEqual("Unauthorized");
      expect(result.message).toEqual("Missing authentication");
    });

    it("should response 404 when thread is not found", async () => {
      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/invalid-thread/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${user1Cred.token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Thread not found");
    });

    it("should response 404 when comment is not found in thread", async () => {
      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/invalid-comment/likes`,
        headers: {
          authorization: `Bearer ${user1Cred.token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(404);
      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("fail");
      expect(result.message).toEqual("Comment not found in this thread!");
    });

    it("should respond 200 and persist comment like if user has not liked before", async () => {
      let likes = await CommentLikesTableTestHelper.findCommentLike({
        commentId,
        owner: user1Cred.user_id,
      });
      expect(likes).toHaveLength(0);

      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${user1Cred.token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");

      likes = await CommentLikesTableTestHelper.findCommentLike({
        commentId,
        owner: user1Cred.user_id,
      });
      expect(likes).toHaveLength(1);
    });

    it("should respond 200 and delete comment like if user has liked before (unlike)", async () => {
      // Arrange
      await CommentLikesTableTestHelper.addCommentLike({
        commentId,
        owner: user1Cred.user_id,
        id: "another-like-1",
      });
      let likes = await CommentLikesTableTestHelper.findCommentLike({
        commentId,
        owner: user1Cred.user_id,
      });
      expect(likes).toHaveLength(1);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${user1Cred.token}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const result = JSON.parse(response.payload);
      expect(result.status).toEqual("success");

      likes = await CommentLikesTableTestHelper.findCommentLike({
        commentId,
        owner: user1Cred.user_id,
      });
      expect(likes).toHaveLength(0);
    });
  });
});
