const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    const payload = {
      thread_id: "thread123",
      owner: "user-123",
      comment_id: "comment-123",
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.softDeleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(payload);

    expect(mockCommentRepository.verifyCommentThread).toBeCalledWith(
      payload.comment_id,
      payload.thread_id
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      payload.comment_id,
      payload.owner
    );
    expect(mockCommentRepository.softDeleteComment).toBeCalledWith(
      payload.comment_id
    );
  });
});
