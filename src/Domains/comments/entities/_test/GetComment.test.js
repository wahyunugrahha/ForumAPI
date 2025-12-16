const GetComment = require("../GetComment");

describe("a GetComment entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "comment-123",
      username: "testcomment",
      date: new Date("2024-10-26T00:00:00Z"),
      content: "123",
      is_deleted: false,
    };

    expect(() => new GetComment(payload)).toThrowError(
      "GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      username: {},
      date: 2021,
      content: "123",
      is_deleted: "false",
      likeCount: "satu",
    };

    expect(() => new GetComment(payload)).toThrowError(
      "GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create GetComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "123",
      date: new Date("2024-10-26T00:00:00Z"),
      content: "123",
      is_deleted: false,
      likeCount 5,
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.is_deleted).toEqual(payload.is_deleted);
    expect(getComment.likeCount).toEqual(payload.likeCount);
  });
});
