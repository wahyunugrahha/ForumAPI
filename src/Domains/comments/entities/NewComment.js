class NewComment {
  constructor(payload) {
    this._validatePayload(payload);

    this.thread_id = payload.thread_id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _validatePayload({ thread_id, content, owner }) {
    if (!thread_id || !content || !owner) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof thread_id != "string" ||
      typeof content != "string" ||
      typeof owner != "string"
    ) {
      throw new Error("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewComment;
