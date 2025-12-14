const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    const payload = {
      reply_id: "reply-123",
      thread_id: "thread123",
      owner: "user-123",
      comment_id: "comment-123",
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyStatus = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.softDeleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(payload);

    expect(mockReplyRepository.verifyReplyStatus).toBeCalledWith(
      payload.reply_id,
      payload.comment_id,
      payload.thread_id
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      payload.reply_id,
      payload.owner
    );
    expect(mockReplyRepository.softDeleteReply).toBeCalledWith(
      payload.reply_id
    );
  });
});
