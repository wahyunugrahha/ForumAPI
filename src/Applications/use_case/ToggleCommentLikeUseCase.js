const InvariantError = require("../../Commons/exceptions/InvariantError");

class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyCommentThread(commentId, threadId);

    const isLiked = await this._commentRepository.checkCommentLike(
      commentId,
      owner
    );

    if (isLiked) {
      await this._commentRepository.deleteCommentLike(commentId, owner);
    } else {
      await this._commentRepository.addCommentLike(commentId, owner);
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
