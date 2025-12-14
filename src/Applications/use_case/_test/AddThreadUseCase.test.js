const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    const payload = {
      title: "test",
      body: "testcuy",
      owner: "user-123",
    };

    const expectedArgument = new NewThread({
      title: payload.title,
      body: payload.body,
      owner: "user-123",
    });

    const mockAddedThread = new AddedThread({
      id: "thread123",
      title: "test",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: "thread123",
          title: "test",
          owner: "user-123",
        })
      )
    );

    const GetThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const result = await GetThreadUseCase.execute(payload);

    expect(result).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(expectedArgument);
  });
});
