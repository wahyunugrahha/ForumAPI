const CommentRepository = require("../CommentRepository");

describe("CommentRepository Interface", () => {
  it("should throw error when invoke abstract behaviour", async () => {
    const commentRepository = new CommentRepository();

    expect(commentRepository.addComment({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.getThreadComments("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.verifyCommentOwner("", "")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.verifyCommentThread("", "")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    expect(commentRepository.softDeleteComment("")).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
