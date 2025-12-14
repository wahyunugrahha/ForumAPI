class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { comment_id, thread_id, owner } = useCasePayload;

    await this._commentRepository.verifyCommentThread(comment_id, thread_id);
    await this._commentRepository.verifyCommentOwner(comment_id, owner);

    await this._commentRepository.softDeleteComment(comment_id);
  }
}

module.exports = DeleteCommentUseCase;
