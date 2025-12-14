const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const NewReply = require("../../../Domains/replies/entities/NewReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const GetThread = require("../../../Domains/threads/entities/GetThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    const payload = {
      thread_id: "thread123",
      comment_id: "comment-123",
      content: "test",
      owner: "user-123",
    };

    const expectedArgument = new NewReply({
      thread_id: "thread123",
      comment_id: payload.comment_id,
      content: payload.content,
      owner: "user-123",
    });

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: "test",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.addReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedReply({
          id: "reply-123",
          content: "test",
          owner: "user-123",
        })
      )
    );

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const GetReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
    });

    const result = await GetReplyUseCase.execute(payload);

    expect(result).toStrictEqual(mockAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(expectedArgument);
    expect(mockCommentRepository.verifyCommentThread).toBeCalledWith(
      "comment-123",
      "thread123"
    );
    expect(mockThreadRepository.verifyThread).toBeCalledWith("thread123");
  });
});
