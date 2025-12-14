const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postAddCommentHandler = this.postAddCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postAddCommentHandler({ params, payload, auth }, h) {
    const useCasePayload = {
      thread_id: params.thread_id,
      content: payload.content,
      owner: auth.credentials.id,
    };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      message: "SUCCESS_ADDED_NEW_COMMENT",
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler({ params, auth }, h) {
    const useCasePayload = {
      comment_id: params.comment_id,
      thread_id: params.thread_id,
      owner: auth.credentials.id,
    };

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute(useCasePayload);

    const response = h.response({ status: "success" });

    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
