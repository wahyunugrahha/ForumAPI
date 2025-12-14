const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository Interface", () => {
  it("should throw error when invoke abstract behaviour", async () => {
    const replyRepository = new ReplyRepository();

    expect(replyRepository.addReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.getThreadReplies("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.verifyReplyOwner("", "")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.verifyReplyStatus("", "", "")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(replyRepository.softDeleteReply("")).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
