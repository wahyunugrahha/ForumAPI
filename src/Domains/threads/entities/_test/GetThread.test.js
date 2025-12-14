const GetThread = require("../GetThread");

describe("an GetThread Entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "test123",
      title: "test",
      body: "testcuy",
    };

    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: "test123",
      title: 123,
      body: "testcuy",
      date: "123",
      username: 123,
      comments: [{ id: 123 }],
    };

    expect(() => new GetThread(payload)).toThrowError(
      "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create GetThread object correctly", () => {
    // Arrange
    const payload = {
      id: "test123",
      title: "test",
      body: "testcuy",
      date: new Date("2024-10-26T00:00:00Z"),
      username: "123",
      comments: [{ id: 123 }],
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.comments).toEqual(payload.comments);
  });
});
