class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.comment_id = payload.comment_id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.content;
    this.is_deleted = payload.is_deleted;
  }

  _verifyPayload({ id, username, comment_id, date, content, is_deleted }) {
    if (
      !id ||
      !username ||
      !date ||
      !comment_id ||
      !content ||
      is_deleted === undefined
    ) {
      throw new Error("GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof username !== "string" ||
      !(date instanceof Date) ||
      typeof comment_id !== "string" ||
      typeof content !== "string" ||
      typeof is_deleted !== "boolean"
    ) {
      throw new Error("GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = GetReply;
