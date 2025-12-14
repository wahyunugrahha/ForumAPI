const NewReply = require("../NewReply");

describe("a NewReply entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      comment_id: "123",
    };

    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      thread_id: "thread124",
      comment_id: "123",
      content: 123,
      owner: "user-123",
    };

    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewReply object correctly", () => {
    // Arrange
    const payload = {
      comment_id: "123",
      content: "123",
      owner: "user-123",
      thread_id: "123",
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.thread_id).toEqual(payload.thread_id);
    expect(newReply.comment_id).toEqual(payload.comment_id);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.owner).toEqual(payload.owner);
  });
});
