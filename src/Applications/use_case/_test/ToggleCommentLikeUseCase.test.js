const ToggleCommentLikeUseCase = require("../ToggleCommentLikeUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("ToggleCommentLikeUseCase", () => {
  it("should orchestrate the toggle like action correctly (like)", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false)); // Not liked yet
    mockCommentRepository.addCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Create Use Case instance
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentThread).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.addCommentLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.deleteCommentLike).not.toHaveBeenCalled();
  });

  it("should orchestrate the toggle like action correctly (unlike)", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.verifyThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true)); // Already liked
    mockCommentRepository.addCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Create Use Case instance
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentThread).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId
    );
    expect(mockCommentRepository.checkCommentLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
    expect(mockCommentRepository.addCommentLike).not.toHaveBeenCalled();
    expect(mockCommentRepository.deleteCommentLike).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    );
  });
});
