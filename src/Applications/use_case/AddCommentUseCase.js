const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NewComment = require("../../Domains/comments/entities/NewComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyThread(useCasePayload.thread_id);

    const addComment = await this._commentRepository.addComment(newComment);

    return new AddedComment(addComment);
  }
}

module.exports = AddCommentUseCase;
