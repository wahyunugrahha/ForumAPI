class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { reply_id, comment_id, thread_id, owner } = useCasePayload;

    await this._replyRepository.verifyReplyStatus(
      reply_id,
      comment_id,
      thread_id
    );
    await this._replyRepository.verifyReplyOwner(reply_id, owner);

    await this._replyRepository.softDeleteReply(reply_id);
  }
}

module.exports = DeleteReplyUseCase;
