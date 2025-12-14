const AddedReply = require("../AddedReply");

describe("a AddedReply entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "test123",
    };

    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "reply-123",
      content: 123,
      owner: "user-123",
    };

    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedReply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "123",
      owner: "user-123",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
