const CommentRepository = require("../../../Domains/comments/CommentRepository");
const GetComment = require("../../../Domains/comments/entities/GetComment");
const GetReply = require("../../../Domains/replies/entities/GetReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const GetThread = require("../../../Domains/threads/entities/GetThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");

describe("GetDetailThreadUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    const payload = {
      thread_id: "thread123",
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThread = jest.fn().mockImplementation(() => {
      return new GetThread({
        id: "thread123",
        title: "thread 123",
        body: "contect of thread 123",
        date: new Date("2024-10-26T00:00:00Z"),
        username: "user-123",
        comments: [],
      });
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getThreadComments = jest
      .fn()
      .mockImplementation(() => {
        return [
          {
            id: "comment-123",
            content: "testcomment",
            username: "testuser1",
            date: new Date("2024-10-26T00:00:00Z"),
            is_deleted: true,
          },
          {
            id: "comment-125",
            content: "testkomen",
            username: "testuser2",
            date: new Date("2024-10-26T00:00:00Z"),
            is_deleted: false,
          },
        ];
      });

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getThreadReplies = jest.fn().mockImplementation(() => {
      return [
        {
          id: "reply-123",
          comment_id: "comment-125",
          content: "1 reply",
          username: "testuser1",
          date: new Date("2024-10-26T00:00:00Z"),
          is_deleted: true,
        },
        {
          id: "reply-128",
          comment_id: "comment-125",
          content: "2 reply",
          username: "testuser2",
          date: new Date("2024-10-26T00:00:00Z"),
          is_deleted: false,
        },
      ];
    });

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await getDetailThreadUseCase.execute(payload);

    expect(result).toEqual(
      new GetThread({
        id: "thread123",
        title: "thread 123",
        body: "contect of thread 123",
        date: new Date("2024-10-26T00:00:00Z"),
        username: "user-123",
        comments: [
          {
            id: "comment-123",
            username: "testuser1",
            date: new Date("2024-10-26T00:00:00Z"),
            content: "**komentar telah dihapus**",
            replies: [],
          },
          {
            id: "comment-125",
            username: "testuser2",
            date: new Date("2024-10-26T00:00:00Z"),
            content: "testkomen",
            replies: [
              {
                id: "reply-123",
                username: "testuser1",
                date: new Date("2024-10-26T00:00:00Z"),
                content: "**balasan telah dihapus**",
              },
              {
                id: "reply-128",
                username: "testuser2",
                date: new Date("2024-10-26T00:00:00Z"),
                content: "2 reply",
              },
            ],
          },
        ],
      })
    );

    expect(mockThreadRepository.verifyThread).toBeCalledWith(payload.thread_id);
    expect(mockThreadRepository.findThread).toBeCalledWith(payload.thread_id);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(
      payload.thread_id
    );
    expect(mockReplyRepository.getThreadReplies).toBeCalledWith(
      payload.thread_id
    );
  });
});
