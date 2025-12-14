const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postAddReplyHandler = this.postAddReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postAddReplyHandler({ params, payload, auth }, h) {
    const useCasePayload = {
      thread_id: params.thread_id,
      comment_id: params.comment_id,
      content: payload.content,
      owner: auth.credentials.id,
    };

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    const response = h.response({
      status: "success",
      message: "SUCCESS_ADDED_NEW_REPLY",
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler({ params, auth }, h) {
    const useCasePayload = {
      reply_id: params.reply_id,
      comment_id: params.comment_id,
      thread_id: params.thread_id,
      owner: auth.credentials.id,
    };

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute(useCasePayload);

    const response = h.response({ status: "success" });

    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
