const AddedReply = require("../../Domains/replies/entities/AddedReply");
const NewReply = require("../../Domains/replies/entities/NewReply");

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);

    await this._threadRepository.verifyThread(useCasePayload.thread_id);
    await this._commentRepository.verifyCommentThread(
      useCasePayload.comment_id,
      useCasePayload.thread_id
    );

    const addReply = await this._replyRepository.addReply(newReply);

    return new AddedReply(addReply);
  }
}

module.exports = AddReplyUseCase;
