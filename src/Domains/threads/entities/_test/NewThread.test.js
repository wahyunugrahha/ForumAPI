const NewThread = require("../NewThread");

describe("an NewThread Entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "test",
    };

    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: 123,
      body: "testcuy",
      owner: true,
    };

    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create NewThread object correctly", () => {
    // Arrange
    const payload = {
      title: "test",
      body: "testcuy",
      owner: "test23",
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
