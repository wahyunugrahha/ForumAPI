const AddedThread = require("../AddedThread");

describe("an AddedThread Entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "test",
    };

    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: 123,
      owner: "test23",
      id: "test123",
    };

    expect(() => new AddedThread(payload)).toThrowError(
      "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create AddedThread object correctly", () => {
    // Arrange
    const payload = {
      title: "test",
      owner: "user-123",
      id: "thread124",
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
